import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as nodejsLambda from "@aws-cdk/aws-lambda-nodejs";
// import { TypeScriptCode } from "@clouden-cdk/aws-lambda-typescript";

export class CusedSitesService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const api = new apigateway.RestApi(this, "cursed-api", {
      restApiName: "Cursed Service",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    const sitesResource = api.root.addResource("sites");

    // get all sites
    const getAllSitesHandler = new nodejsLambda.NodejsFunction(
      this,
      "GetCursedSitesHandler",
      {
        entry: "resources/cursedSites.ts",
        handler: "getAllHandler",
      }
    );
    sitesResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getAllSitesHandler)
    );

    const proxyResource = api.root.addResource("proxy");
    const proxySiteHandler = new nodejsLambda.NodejsFunction(
      this,
      "ProxySiteHandler",
      {
        entry: "resources/proxy.ts",
        handler: "proxySiteHandler",
      }
    );
    proxyResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(proxySiteHandler)
    );
  }
}
