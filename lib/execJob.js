import { execFile } from "child_process";
import path from "path";
import fs from "fs";

import tmp from "tmp";

export default function execJob(jobName, params) {
  const script = `
  const {${jobName}} = require("${path.join(
    process.cwd(),
    "jobs",
    jobName
  )}.js");
  async function run() {
    try {
      await ${jobName}(${JSON.stringify(params)});
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
      path.join(process.cwd(), "jobs/.babelrc.js"),
    ],
    {
      env: {
        ...process.env,
        NODE_OPTIONS: "--enable-source-maps --unhandled-rejections=strict",
      },
    },
    function (err) {
      if (err) {
        console.error(`Error while running jobs/${jobName}.js`);
      } else {
        console.log(`Success running jobs/${jobName}.js`);
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

  return child;
}
