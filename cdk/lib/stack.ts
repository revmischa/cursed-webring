import * as cdk from "@aws-cdk/core";
import { CursedMirror } from "./cursedMirror";
import { CursedSitesService } from "./cursedSitesService";
import { CursedDB } from "./db";

export class CursedStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const db = new CursedDB(this, "CursedDB");
    new CursedSitesService(this, "CursedSiteServices", {
      submissionsTable: db.submissionsTable,
    });
    new CursedMirror(this, "CursedSiteMirrorCDN");
  }
}
