import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { LambdaIntegration, RestApi } from "@aws-cdk/aws-apigateway";
import * as sm from "@aws-cdk/aws-secretsmanager";
import { Table } from "@aws-cdk/aws-dynamodb";
import { CfnOutput } from "@aws-cdk/core";

const slackWebhookSecret =
  "arn:aws:secretsmanager:eu-west-1:178183757879:secret:cursed/slack_webhook_url-MwQ0dY";

interface CursedSitesServiceProps {
  submissionsTable: Table;
}
export class CursedSitesService extends core.Construct {
  constructor(
    scope: core.Construct,
    id: string,
    props: CursedSitesServiceProps
  ) {
    super(scope, id);

    const secret = sm.Secret.fromSecretCompleteArn(
      this,
      "SlackWebhookSecret",
      slackWebhookSecret
    );

    const env = {
      SLACK_WEBHOOK_URL: secret.secretValue.toString(),
      CURSED_SITE_SUBMISSIONS_TABLE_NAME: props.submissionsTable.tableName,
    };

    const api = new RestApi(this, "cursed-api", {
      restApiName: "Cursed Service",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    const sitesResource = api.root.addResource("sites");

    // get all sites
    const getAllSitesHandler = new NodejsFunction(
      this,
      "GetCursedSitesHandler",
      {
        entry: "resources/cursedSites.ts",
        handler: "getAllHandler",
      }
    );
    sitesResource.addMethod("GET", new LambdaIntegration(getAllSitesHandler));

    // proxy
    const proxyResource = api.root.addResource("proxy");
    const proxySiteHandler = new NodejsFunction(this, "ProxySiteHandler", {
      entry: "resources/proxy.ts",
      handler: "proxySiteHandler",
    });
    proxyResource.addMethod("GET", new LambdaIntegration(proxySiteHandler));

    // submit
    const submitSiteHandler = new NodejsFunction(
      this,
      "SubmitCursedSiteHandler",
      {
        entry: "resources/cursedSites.ts",
        handler: "submitHandler",
        environment: env,
      }
    );
    props.submissionsTable.grantWriteData(submitSiteHandler);
    sitesResource.addMethod("POST", new LambdaIntegration(submitSiteHandler));

    // outputs
    new CfnOutput(this, `SitesEndpoint`, {
      value: api.urlForPath(sitesResource.path),
    });
  }
}
