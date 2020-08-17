import * as sns from "@aws-cdk/aws-sns";
import * as subscriptions from "@aws-cdk/aws-sns-subscriptions";
import * as cdk from "@aws-cdk/core";
import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";
import * as rds from "@aws-cdk/aws-rds";
import * as ec2 from "@aws-cdk/aws-ec2";

import { NodejsFunction } from "aws-lambda-nodejs-webpack";

export default class ExampleStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // define lambdas
    const defaultLambdaOptions = {
      timeout: cdk.Duration.seconds(30),
      // Here you can pass any environment variable you'd like to be available in your Lambda
      environment: {
        APP_ENV: process.env.APP_ENV,
      },
    };

    const generatePdfLambda = new NodejsFunction(this, "generatePdfLambda", {
      entry: "jobs/generatePdf.js",
      handler: "generatePdf",
      ...defaultLambdaOptions,
    });

    const checkTwitterLambda = new NodejsFunction(this, "checkTwitterLambda", {
      entry: "jobs/checkTwitter.js",
      handler: "checkTwitter",
      ...defaultLambdaOptions,
    });

    // run jobs/checkTwitter.js every 2 minutes
    const rule = new events.Rule(this, "ScheduleRule", {
      schedule: events.Schedule.cron({ minute: "*/2" }),
    });
    rule.addTarget(new targets.LambdaFunction(checkTwitterLambda));

    // run jobs/generatePdfTopic.js whenever a message is published on the associated topic
    const generatePdfTopic = new sns.Topic(this, "generatePdfTopic");
    generatePdfTopic.addSubscription(
      new subscriptions.LambdaSubscription(generatePdfLambda)
    );

    // create the database
    // a vpc is always needed for databases
    const vpc = new ec2.Vpc(this, "example-vpc");
    this.database = new rds.DatabaseInstance(this, "exampleDatabase", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_12_3,
      }),
      instanceIdentifier: "example",
      masterUsername: "example",
      databaseName: "example",
      vpc,
      instanceType: new ec2.InstanceType("t2.micro"), // see all types here: https://aws.amazon.com/rds/instance-types/
      vpcPlacement: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      deletionProtection: false,
    });
  }
}
