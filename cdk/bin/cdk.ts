#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { CursedStack } from "../lib/stack";

const envEU: cdk.Environment = { account: "178183757879", region: "eu-west-1" };

const app = new cdk.App();
new CursedStack(app, "CursedStack", { env: envEU });
