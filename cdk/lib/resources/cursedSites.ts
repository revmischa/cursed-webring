import axios from "axios";
const csv = require("csv-parser");

type Row = Record<string, string>;
async function getAllHandler() {
  return {
    statusCode: 200,
    body: await getAllAndParse(),
  };
}

function getAllAndParse() {
  return new Promise(async (resolve, reject) => {
    const res = await axios.get(
      "https://docs.google.com/spreadsheets/d/1ehUKvA3bdcZmYnPxTMgoQeOKSkqdt0N10f4HK8rk_PM/export?format=csv",
      { responseType: "stream" }
    );

    const results: Row[] = [];
    res.data
      .pipe(csv(["url", "title", "description"]))
      .on("data", (data: Row) => results.push(data))
      .on("end", () => {
        resolve(results);
      });
  });
}

module.exports.getAllAndParse = getAllAndParse;
module.exports.getAllHandler = getAllHandler;
