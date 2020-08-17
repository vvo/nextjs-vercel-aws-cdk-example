import * as cdk from "@aws-cdk/core";
import ExampleStack from "./ExampleStack";

const app = new cdk.App();
const stack = new ExampleStack(app, "example-app", {
  description: "An example application",
});
