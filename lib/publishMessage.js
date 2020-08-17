// this file allows us to either publish messages to AWS (production) or to our own
// SNS local implementation
import { SNS } from "@aws-sdk/client-sns";

import {
  appEnv,
  awsAccessKeyId,
  awsSecretAccessKey,
  awsRegion,
  domain,
  protocol,
} from "lib/privateConf";

export default async function publishMessage(topicName, messageObject) {
  console.log(
    `Sending message: ${JSON.stringify(messageObject)} to topic: ${topicName}`
  );

  if (appEnv === "production") {
    const snsClient = new SNS({
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
      region: awsRegion,
      apiVersion: "2010-03-31",
    });

    const { Topics: topics } = await snsClient.listTopics({});
    // {} is a bug from AWS, see https://github.com/aws/aws-sdk-js-v3/issues/424
    const topicArn = topics.find((topic) => {
      return topic.TopicArn.includes(`:example-app-topicName`);
    });

    await snsClient.publish({
      TopicArn: topicArn,
      Message: JSON.stringify(messageObject),
    });
  } else {
    // dev mode, we still do a request, as if we were on AWS
    await fetch(`${protocol}://${domain}/api/__devPublishMessage`, {
      method: "POST",
      body: JSON.stringify({ topic: topicName, message: messageObject }),
      headers: { "content-type": "application/json" },
    });
  }
}
