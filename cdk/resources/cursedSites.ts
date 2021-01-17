import axios from "axios";
const csvparse = require("csv-parse/lib/sync");

type Row = Record<string, string>;
export async function getAllHandler() {
  return {
    statusCode: 200,
    body: JSON.stringify(await getAllAndParse()),
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