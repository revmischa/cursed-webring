import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";
import { saveSubmission } from "./db";
import { webhook } from "./slack";

const csvparse = require("csv-parse/lib/sync");

type Row = Record<string, string>;

/**
 * Fetch all cursed sites
 */
export async function getAllHandler() {
  let records = await getAllAndParse();
  records = shuffle(records);
  return {
    statusCode: 200,
    body: JSON.stringify(records),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
}

export async function getAllAndParse(): Promise<Row[]> {
  const res = await axios.get(
    "https://docs.google.com/spreadsheets/d/1ehUKvA3bdcZmYnPxTMgoQeOKSkqdt0N10f4HK8rk_PM/export?format=csv"
  );

  return csvparse(res.data, {
    columns: ["url", "title", "description"],
  });
}

function shuffle(array: any[]) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * User submits a site to the webring
 */
export async function submitHandler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const params = JSON.parse(event.body!);

  await Promise.all([
    saveSubmission(params.url, params.submitter, params.title),
    webhook.send({
      text: `URL: ${params.url}
Title: ${params.title}
Submitter: ${params.submitter}`,
    }),
  ]);

  return {
    statusCode: 201,
    body: "ok",
  };
}
