import {
  CloudFrontWebDistribution,
  OriginProtocolPolicy,
} from "@aws-cdk/aws-cloudfront";
import * as core from "@aws-cdk/core";

const certificateArn =
  "arn:aws:acm:us-east-1:178183757879:certificate/79e60ba9-5507-4ce5-8ced-2d9d1ddb1d5c";

export class CursedMirror extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    new CloudFrontWebDistribution(this, "cursed-mirrors", {
      originConfigs: [
        {
          customOriginSource: {
            domainName: "cursed.llolo.lol.s3-website-eu-west-1.amazonaws.com",
            httpPort: 80,
            originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      aliasConfiguration: {
        acmCertRef: certificateArn,
        names: ["cursed.llolo.lol"],
      },
    });
  }
}
