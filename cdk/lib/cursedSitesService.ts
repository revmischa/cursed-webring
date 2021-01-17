import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
// import { TypeScriptCode } from "@clouden-cdk/aws-lambda-typescript";

export class CusedSitesService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const handler = new lambda.Function(this, "GetCursedSitesHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("lib/resources"),
      handler: "cursedSites.getAll",
    });

    const api = new apigateway.RestApi(this, "cursed-api", {
      restApiName: "Cursed Service",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    const getAllCursedSitesIntegration = new apigateway.LambdaIntegration(
      handler,
      {
        requestTemplates: { "application/json": '{ "statusCode": "200" }' },
      }
    );

    const sitesResource = api.root.addResource("sites");
    // sitesResource.defaultCorsPreflightOptions = CORS;
    sitesResource.addMethod("GET", getAllCursedSitesIntegration);
  }
}
