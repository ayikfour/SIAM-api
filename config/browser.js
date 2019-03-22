import puppeteer from "puppeteer";

export default async function Browser() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true
  });

  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on("request", req => {
    if (
      req.resourceType() === "image" ||
      req.resourceType() === "stylesheet" ||
      req.resourceType() === "font"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  return { page, browser };
}
