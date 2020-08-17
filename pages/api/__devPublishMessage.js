// This file is the local equivalent of sending messages to SNS on AWS.
// It's an API route that will spawn files in jobs/ using babel-node
import { appEnv } from "lib/privateConf";
import execJob from "lib/execJob";

export default function __devPublishMessage(req, res) {
  if (appEnv === "production") {
    res.status(404).end();
    return;
  }

  res.json({ ok: true });

  // remember: executing code after res.json() only works in dev, not Vercel/AWS

  const { topic: jobName, message: messageObject } = req.body;
  execJob(jobName, {
    Records: [{ Sns: { Message: JSON.stringify(messageObject) } }],
  });
}
