import * as cdk from "@aws-cdk/core";
import { CursedMirror } from "./cursedMirror";
import { CusedSitesService } from "./cursedSitesService";

export class CursedStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CusedSitesService(this, "CursedSiteServices");
    new CursedMirror(this, "CursedSiteMirrorCDN");
  }
}
