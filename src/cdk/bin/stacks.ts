#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ZoogenyStack } from "../lib/zoogeny-stack";

const app = new cdk.App();
new ZoogenyStack(app, "ZoogenyStack", {});
