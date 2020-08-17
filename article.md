---
title: Coding the Jamstack missing parts: queues and cron jobs
published: false
description: 
tags: 
//cover_image: https://direct_url_to_image.jpg
---

TODO:
- Move disgressions into a more of that part
- Remove dedundancies

tl;dr; For my current product, I use Next.js deployed on Vercel. As for all my other services like databases, cron jobs and queues, I use AWS.

The AWS parts are deployed with Cloud Development Kit, using a single command and 10 lines of JavaScript.

Bonus: I even have a local environment replicating this.

---

# Discovering the Jamstack world

Since I have been playing with platforms like Vercel and Netlify, I have been wondering: what about databases, cron jobs and queues? Jamstack platforms are providers allowing you to easily deploy static websites and API calls (through "lambda functions"), but that's it. If you need something else, you need to use other services.

Coming from Heroku, I was disappointed because it meant I had to spend time researching other solutions, comparing them and deciding if I should use it or not.

And on top of that it would possibly mean having lots of different moving parts.

# Why do you even need cron jobs and queues?

At some point you need a database, that's obvious. As for cron jobs and queues:

Let's say you're building a saas that monitors twitter for specific words. For this to work, static generators and API routes won't be enough: you need something that can frequently call your API that in turn will check twitter for such words. **This is a cron job**. You cannot rely on user actions to achieve such work.

Now in your UI, you also have a button that will generate a PDF report for a specific word and send it to an email address. This is potentially a "long" running job, something like 10 seconds. The right way to handle this is to **use a queue** that will make sure this job is processed.

One could say that this could be handled without a queue, by just having an API route that replies immediately and continue to execute some code. Unfortunately, 1. This won't work on AWS (i.e. Vercel and Netlify) and 2. If the job fails, you'd have to record it and inform the user they need to click again. While a queue could try again.

**Jamstack platforms like Vercel and Netlify won't help you (for now) whenever you need some code to be executed without user action.**

Once I knew that and what I needed, I went solutions-hunting.

# Requirements

The solution I was looking for, should, for the most parts:

- Be a single solution, I don't want to maintain a job queue hosted on x.com and cron jobs hosted on y.com. This would be a mess.
- Be cheap, I am cheap
- Be on AWS. Because I got credits ($1,000) and you can get them too via https://www.joinsecret.com. Plus, a big part of Vercel's infrastructure is hosted on AWS, so I thought the network between the two would be good.
- Be easy to administrate, modify, and deploy. Ideally with code, not YAML files. And without requiring me to create different projects.

After multiple searches, I settled on using AWS this way:
- cron jobs: CloudWatch events coupled with lambda
- queues: SNS coupled with lambda. One would have used SQS or a more complex pattern I believe. But I yet have to become more AWS experienced before diving into SQS and its configuration.
- database: [RDS](https://aws.amazon.com/fr/rds/)

☝️For anyone experienced with AWS, this may be the usual stack BUT it literally took me days to find and understand those solutions.

# Deploying the infrastructure

Great! Now how do I easily deploy and maintain all of that? I found the AWS console pretty good, you can basically create your whole infrastructure in just a few clicks and even code your lambdas inside a web browser: amazing.

But I said I needed the solution to "Be easy to administrate, modify and deploy. Ideally with code.".

After more research, I understood that what I was looking for was infrastructure as code tools (IaC), to control AWS services. IaC tools can range from python files to configure servers, to gigantic YAML files to deploy AWS services. But I was not interested in that, I am a JavaScript developer, there must be another way.

## The right tool for the job: AWS Cloud Development Kit

I found the AWS Cloud Development Kit (CDK) randomly browsing IaC tools, it was mentioned on the Pulumi page.

Since I was gonna use AWS, better maybe try their tools! I gave it a try and it was an immediate match:
- I could put my JavaScript jobs files in any directory I wanted
- I could use import statements even with just JavaScript
- It would only build the lambda with the npm modules I was using inside the job files, not all my dependencies!

The way CDK works as for Node.js lambdas is to use a Parcel on the input file to generate a bundle. Then the bundle is zipped and uploaded to AWS. This is the responsibility of CDK Constructs and you have constructs for a lot of different languages and AWS services.

<details>
  <summary>The only issue with CDK</summary>

  I hit a single issue with CDK: For now they run Parcel inside Docker, by previously mounting your whole JavaScript project as a Docker volume. Unfortunately, on MacOS, mounting big volumes is notoriously slow with Docker. And even the latest updates to Docker, it will still be slow. Only Mounting a small Next.js project would take between 20s and 2 minutes.

I spent a LOT of time on this issue, and I was lucky to be able to discuss with CDK maintainers like Jo. At some point they will provide a Node.js construct that will not use Docker. In the meantime, I created my own construct which works pretty well: https://github.com/vvo/aws-lambda-nodejs-webpack.
</details>

<details>
<summary>Interested in the other tools I tried? Open this section</summary>

## Architect

https://arc.codes/

Architect looked like what I needed: control AWS services via simple YAML files while also getting a local environment replicating your AWS infrastructure.

I played with it a little, asked some questions on their slack, only to discover that once you were using Architect, your whole codebase should be controlled and deployed by it. You can't easily mix a Next.js website deployed on Vercel and cron jobs hosted on AWS crontrolled by Archited.

Next!

## Pulumi

The first tool I tried was [Pulumi](https://www.pulumi.com/). Which is multi-cloud. I was happy to find out you could easily create lambda functions on AWS that would get regularly called, just like cron jobs. While also using SQS, the queue from AWS and link it to lambdas as well.

I had dumb issues with Pulumi: not being able to easily use import statements if you're not using TypeScript, all dependencies from my package.json would be installed on AWS, instead of only the dependencies my jobs are using.

Pulumi was the first IaC tool I really tried and most probably suffered from my lack of investment in it. I am sure it's a wonderful tool.

But I needed to try another one. Next!
</details>

# An example Next.js project with CDK



# Cost

Compute cost for a job that runs every minute, takes 2s

# Next steps
- Store secrets in AWS and reuse them in Vercel
- Single pipeline to deploy Vercel and AWS at every commit
- Get AWS database url and secrets via API calls then store inside Vercel automatically
- single place where CRONS are defined (dev/prod)
- every pull request should have an isolated environment on AWS (database, topic, lambdas)

# PS: Startup credits
For credits:
- https://www.joinsecret.com/ (Ask Jean Loup for referal link)
- https://aws.amazon.com/activate/

Local environment
docker-compose
overmind
dev only API route that spawns files
cron cli utility

Side note: you could also host all your JavaScript code on Vercel and use AWS only for SNS + crons those would be calling HTTP endpoints instead





