import cron from "cron";
import execJob from "./lib/execJob";

// add more cron jobs here
const cronJobs = {
  "*/10 * * * * *": "checkTwitter", // check twitter every 10 seconds
};

// let's iterate over all cron jobs and start them
Object.entries(cronJobs).forEach(([cronExpression, jobName]) => {
  cron
    .job(cronExpression, function () {
      execJob(jobName);
    })
    .start();
});
