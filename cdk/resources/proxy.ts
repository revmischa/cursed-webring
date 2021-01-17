import axios from "axios";
import { APIGatewayProxyEvent } from "aws-lambda";

export async function proxySiteHandler(event: APIGatewayProxyEvent) {
  const proxyUrl = event.queryStringParameters.url;
  const headers = event.headers;
  console.log(headers);
  const referrer = headers.Referer;

  if (
    referrer &&
    (referrer.startsWith("https://cursed.netlify.app") ||
      referrer.startsWith("https://master--cursed-webring.netlify.app") ||
      referrer.startsWith("http://localhost"))
  ) {
    if (!proxyUrl) {
      throw new Error("missing proxy dest");
    }
    return {
      statusCode: 200,
      body: await getProxied(proxyUrl),
      headers: {
        "Content-type": "text/html",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } else {
    throw new Error("missing proxy dest");
  }
}

export async function getProxied(url: string): Promise<string> {
  const res = await axios.get(url);
  return res.data;
}
