// this file allows you to publish messages to any AWS SNS topic

import publishMessage from "lib/publishMessage";

export default function publishMessageRoute(req, res) {
  // You would have to protect this route just like any other API route
  // so that no one can publish messages that are not tied to the data they own

  await publishMessage(req.body.topic, req.body.message);
  res.send({ ok: true });
}
