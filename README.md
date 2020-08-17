# cdk-example

_Companion project of the article at https://..._

This is a Next.js example coupled with AWS services to provide:
- database
- cron jobs
- asynchronous jobs

The goal is to have Next.js being deployed on Vercel, with resources being deployed on AWS via AWS Cloud Development Kit.

## Requirements

- Node.js via nvm: https://github.com/nvm-sh/nvm#installing-and-updating
- Yarn: https://classic.yarnpkg.com/en/docs/install#alternatives-stable
- An AWS account: https://portal.aws.amazon.com/billing/signup
- Installed and configured AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

## How to use

1. Fork this repository, add it to your Vercel projects, deploy it
2. Clone the repository locally and run:

```bash
yarn
yarn cdk deploy # first run can be long
```

This will deploy the services to AWS.

3. Add necessary env variables to your Vercel project

The list of env variables is: `SECRET_AWS_ACCESS_KEY_ID`, `SECRET_AWS_SECRET_ACCESS_KEY` and `SECRET_AWS_REGION`.

See https://vercel.com/blog/environment-variables-ui on how to add them.

4. Verify it's working

You can check in CloudWatch logs at https://console.aws.amazon.com/cloudwatch/home that your functions are called:
- every 5 minutes for events/checkTwitter.js
- when you click on the "Generate PDF" button in your production Vercel application

## Tips

If your stack is in an unstable situation (cannot deploy or destroy), then go to https://console.aws.amazon.com/cloudformation and delete it manually.
