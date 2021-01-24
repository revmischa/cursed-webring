import * as core from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class CursedDB extends core.Construct {
  submissionsTable: dynamodb.Table;

  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    this.submissionsTable = new dynamodb.Table(this, "SubmissionsTable", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    new core.CfnOutput(this, "SubmissionsTableName", {
      value: this.submissionsTable.tableName,
    });
  }
}
