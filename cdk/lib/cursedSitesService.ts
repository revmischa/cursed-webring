import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as sm from "@aws-cdk/aws-secretsmanager";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { LambdaIntegration, RestApi } from "@aws-cdk/aws-apigateway";
import { Table } from "@aws-cdk/aws-dynamodb";
import { CfnOutput } from "@aws-cdk/core";
import { Tracing } from "@aws-cdk/aws-lambda";

// ARN of a secret containing the slack webhook URL
const slackWebhookSecret =
  "arn:aws:secretsmanager:eu-west-1:178183757879:secret:cursed/slack_webhook_url-MwQ0dY";

// required properties to instantiate our construct
// here we pass in a reference to our DynamoDB table
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

    // load our webhook secret at deploy-time
    const secret = sm.Secret.fromSecretCompleteArn(
      this,
      "SlackWebhookSecret",
      slackWebhookSecret
    );

    // our API Gateway with CORS enabled
    const api = new RestApi(this, "cursed-api", {
      restApiName: "Cursed Service",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
      deployOptions: { tracingEnabled: true },
    });

    // defines the /sites/ resource in our API
    const sitesResource = api.root.addResource("sites");

    // get all sites handler, GET /sites/
    const getAllSitesHandler = new NodejsFunction(
      this,
      "GetCursedSitesHandler",
      {
        entry: "resources/cursedSites.ts",
        handler: "getAllHandler",
        tracing: Tracing.ACTIVE,
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

    // submit, POST /sites/
    const submitSiteHandler = new NodejsFunction(
      this,
      "SubmitCursedSiteHandler",
      {
        entry: "resources/cursedSites.ts",
        handler: "submitHandler",
        environment: {
          // let our function access the webhook and dynamoDB table
          SLACK_WEBHOOK_URL: secret.secretValue.toString(),
          CURSED_SITE_SUBMISSIONS_TABLE_NAME: props.submissionsTable.tableName,
        },
      }
    );
    // allow submit function to write to our dynamoDB table
    props.submissionsTable.grantWriteData(submitSiteHandler);
    sitesResource.addMethod("POST", new LambdaIntegration(submitSiteHandler));

    // outputs
    new CfnOutput(this, `SitesEndpoint`, {
      value: api.urlForPath(sitesResource.path),
    });
  }
}
