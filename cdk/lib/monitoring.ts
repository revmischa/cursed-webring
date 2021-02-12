import * as core from "@aws-cdk/core";
import { Canary, Runtime, Code, Schedule } from "@aws-cdk/aws-synthetics";
import * as path from "path";
import { Duration } from "@aws-cdk/core";
import { Alarm, ComparisonOperator } from "@aws-cdk/aws-cloudwatch";

export class CursedMirror extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const getSitesCanary = new Canary(this, "GetSitesCanary", {
      runtime: Runtime.SYNTHETICS_NODEJS_2_2,
      test: {
        code: Code.fromAsset(path.join(__dirname, "canary", "api-monitor.js")),
        handler: "api-monitor.handler",
      },
      schedule: Schedule.rate(Duration.minutes(5)),
    });

    new Alarm(this, "CanaryAlarm", {
      metric: getSitesCanary.metricSuccessPercent(),
      evaluationPeriods: 2,
      threshold: 90,
      comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
    });
  }
}
