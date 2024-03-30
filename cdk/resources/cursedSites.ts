import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";
import { saveSubmission } from "./db";
import { sendToWebhook } from "./slack";
import { ISubmissionParams } from "../../src/Model/Submission";
import { shuffle } from "./util";
const csvparse = require("csv-parse/lib/sync");

type Row = Record<string, string>;

const CORSHeaders = {
  "Access-Control-Allow-Origin": "*",
};

/**
 * Fetch all cursed sites
 */
export async function getAllHandler() {
  let records = await getAllAndParse();
  records = shuffle(records).filter((r) => r && r.url.trim());
  return {
    statusCode: 200,
    body: JSON.stringify(records),
    headers: CORSHeaders,
  };
}

/**
 * Grab site list from google doc
 */
export async function getAllAndParse(): Promise<Row[]> {
  const res = await axios.get(
    "https://docs.google.com/spreadsheets/d/1ehUKvA3bdcZmYnPxTMgoQeOKSkqdt0N10f4HK8rk_PM/export?format=csv"
  );

  return csvparse(res.data, {
    columns: ["url", "title", "description"],
  });
}

/**
 * User submits a site to the webring
 */
export async function submitHandler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const params: ISubmissionParams = JSON.parse(event.body!);

  await Promise.all([
    saveSubmission(params),
    sendToWebhook({
      text: `URL: ${params.url}
Title: ${params.title}
Submitter: ${params.submitter}`,
    }),
  ]);

  return {
    statusCode: 201,
    body: "ok",
    headers: CORSHeaders,
  };
}
