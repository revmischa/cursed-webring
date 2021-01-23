const { IncomingWebhook } = require("@slack/webhook");

const url = process.env.SLACK_WEBHOOK_URL;

export const webhook = new IncomingWebhook(url);
