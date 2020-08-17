// This file is the local equivalent of sending messages to SNS on AWS.
// It's an API route that will spawn files in events/ using babel-node

import { execFile } from "child_process";
import path from "path";
import fs from "fs";

import tmp from "tmp";

import { appEnv } from "lib/privateConf";

export default function __publishMessage(req, res) {
  if (appEnv === "production") {
    res.status(404).end();
    return;
  }

  res.json({ ok: true });

  // remember: executing code after res.json() only works in dev, not Vercel/AWS

  const { topic, message } = req.body;
  const handler = topic;

  const script = `
  const {${handler}} = require("${path.join(
    process.cwd(),
    "events",
    handler
  )}.js");
  async function run() {
    try {
      await ${handler}({
        Records:
          [
            {Sns:
              {Message:
                JSON.stringify(${JSON.stringify(message)})
              }
            }
          ]
        }
      );
    } catch (error) {
      // if necessary, here you could do some cleanup like destroying pending database connections
      throw error;
    }
  }

  run();`;

  const tmpFile = tmp.fileSync();
  fs.writeSync(tmpFile.fd, script);

  const babelNodeBin = path.join(process.cwd(), "node_modules/.bin/babel-node");

  const child = execFile(
    babelNodeBin,
    [
      tmpFile.name,
      "--config-file",
      path.join(process.cwd(), "events/.babelrc.js"),
    ],
    {
      env: {
        ...process.env,
        NODE_OPTIONS: "--enable-source-maps --unhandled-rejections=strict",
      },
    },
    function (err) {
      if (err) {
        console.error(`Error while running events/${topic}.js`);
      } else {
        console.log(`Success running events/${topic}.js`);
      }

      tmpFile.removeCallback();
    }
  );

  child.stdout.on("data", (data) => {
    return console.log(data);
  });

  child.stderr.on("data", (data) => {
    return console.error(data);
  });
}
