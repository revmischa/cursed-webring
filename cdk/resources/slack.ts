const { IncomingWebhook } = require("@slack/webhook");

const url = process.env.SLACK_WEBHOOK_URL;

export const sendToWebhook = (
  params: Record<string, string>
): Promise<void> => {
  const webhook = new IncomingWebhook(url);
  return webhook.send(params);
};
