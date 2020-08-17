# nextjs-vercel-aws-cdk-example

_Companion project of the article at https://..._

This is a Next.js example coupled with AWS services to provide:
- database ([RDS](https://aws.amazon.com/rds/))
- cron jobs ([EventBridge](https://aws.amazon.com/eventbridge/) + [Lambda](https://aws.amazon.com/lambda/))
- asynchronous jobs ([SNS](https://aws.amazon.com/sns/) + [Lambda](https://aws.amazon.com/lambda/))

The goal is to have Next.js being deployed on Vercel, with resources being deployed on AWS via [AWS Cloud Development Kit](https://aws.amazon.com/cdk/). The AWS stack is described and deployed via a single JavaScript file ([infra/ExampleStack.js](./infra/ExampleStack.js)) thanks to AWS CDK's infrastructure as code (IaC) features.

This example provides local tools to replicate the AWS services in development mode.

## Requirements

- Node.js via nvm: https://github.com/nvm-sh/nvm#installing-and-updating
- Yarn: https://classic.yarnpkg.com/en/docs/install#alternatives-stable
- An AWS account: https://portal.aws.amazon.com/billing/signup
- Installed and configured AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
- [Docker Desktop](https://www.docker.com/products/docker-desktop) for ease of running a local database
- [overmind](https://github.com/DarthSim/overmind) for ease of running multiple local services

## How to use

1. Fork this repository, add it to your Vercel projects, deploy it
2. Clone the repository locally and run

```bash
yarn
yarn cdk deploy # first run can be long
```

This will deploy the services to AWS.

3. Add necessary env variables to your Vercel project:

You need to add `SECRET_AWS_ACCESS_KEY_ID`, `SECRET_AWS_SECRET_ACCESS_KEY` and `SECRET_AWS_REGION` to Vercel, see https://vercel.com/blog/environment-variables-ui on how to do it.

1. Verify it's working:

You can check in CloudWatch logs at https://console.aws.amazon.com/cloudwatch/home that your functions are called:
- every 5 minutes for jobs/checkTwitter.js
- when you click on the "Generate Pdf" button in your production Vercel application for jobs/generatePdf.js.

## Local development

In local development, all you have to do is:

```bash
overmind start
```

By reading the [Procfile](./Procfile) This will start:
- The Next.js app in development mode
- The PostgreSQL database via Docker
- The cron jobs defined in [cron-jobs.js](./cron-jobs.js)

## Tips and docs

- If your stack is in an unstable situation (cannot deploy or destroy), then go to https://console.aws.amazon.com/cloudformation and delete it manually.
- CDK API: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html
- CDK guide: https://docs.aws.amazon.com/cdk/latest/guide/home.html
- CDK command line: https://docs.aws.amazon.com/cdk/latest/guide/cli.html
