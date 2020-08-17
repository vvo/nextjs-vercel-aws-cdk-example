// this file allows us to either publish messages to AWS (production) or to our own
// SNS local implementation
import { SNS } from "@aws-sdk/client-sns";

import {
  appEnv,
  awsAccessKeyId,
  awsSecretAccessKey,
  awsRegion,
  domain,
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
      ...getSnsOptions(),
    });

    const { Topics: topics } = await snsClient.listTopics({});
    const topicArn = topics.find((topic) => {
      return topic.includes(`:example-app-topicName`);
    });

    await snsClient.publish({
      TopicArn: topicArn,
      Message: JSON.stringify(messageObject),
    });
  } else {
    // dev mode
    await fetch(`https://${domain}/api/__publishMessage`, {
      method: "POST",
      body: JSON.stringify({ topic: topicName, message: messageObject }),
      headers: { "content-type": "application/json" },
    });
  }
}
