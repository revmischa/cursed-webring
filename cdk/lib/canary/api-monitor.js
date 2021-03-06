var synthetics = require("Synthetics");
const log = require("SyntheticsLogger");

const pageLoadBlueprint = async function () {
  // INSERT URL here
  const URL = "https://api.example.com/user/books/topbook/";

  let page = await synthetics.getPage();
  const response = await page.goto(URL, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  //Wait for page to render.
  //Increase or decrease wait time based on endpoint being monitored.
  await page.waitFor(15000);
  // This will take a screenshot that will be included in test output artifacts
  await synthetics.takeScreenshot("loaded", "loaded");
  let pageTitle = await page.title();
  log.info("Page title: " + pageTitle);
  if (response.status() !== 200) {
    throw "Failed to load page!";
  }
};

exports.handler = async () => {
  return await pageLoadBlueprint();
};
