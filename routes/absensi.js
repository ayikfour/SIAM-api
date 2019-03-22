import cheerio from "cheerio";
import Browser from "../config/browser";

export default async function Absen(req, res) {
  const url = "https://siam.ub.ac.id/absensi.php";

  try {
    const { page, browser } = await Browser();
    await page.setCookie(req.auth.cookies[1]);
    await page.goto(url);
    await page.waitForSelector("table[width='600']");

    const content = await page.content();
    const absensi = scrapeAbsen(content);

    browser.close();
    res.json({ absensi });
  } catch (error) {
    res.status(500).send("internal error");
  }
}

function scrapeAbsen(content) {
  const $ = cheerio.load(content);

  const headers = $("tr.textWhite").children();
  const value = $("table[width='600'] tbody tr.text");

  let head = headers
    .map((i, el) => {
      let headname = $(el)
        .text()
        .split(" ")
        .join("");

      return headname;
    })
    .get();

  let jadwal = value
    .map((i, el) => {
      let current = {};
      let item = $(el)
        .children()
        .map((j, child) => {
          return $(child).text();
        })
        .get();

      item.forEach((el, i) => {
        current[head[i]] = el;
      });

      return current;
    })
    .get();

  return jadwal;
}
