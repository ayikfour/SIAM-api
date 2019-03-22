import cheerio from "cheerio";
import Portal from "./portal";
import Browser from "./browser";

export default async function Profile(req, res) {
  const url = "https://siam.ub.ac.id/akademik.php";

  try {
    const { page, browser } = await Browser();
    await page.setCookie(req.auth.cookies[1]);
    await page.goto(url);
    await page.waitForSelector("td[width='363']");

    const content = await page.content();
    browser.close();

    const $ = cheerio.load(content);
    const profile = scrapeProfile($);

    res.json({ profile });
  } catch (error) {
    res.status(500).send(error);
  }
}

function scrapeProfile($) {
  const bioInfo = $("div.bio-info").find("div");
  const status = $("big[style='color:#1262A8']").text();

  let bio = {};

  bioInfo.each((i, div) => {
    let current = $(div).text();

    switch (i) {
      case 0:
        bio = { ...bio, nim: current };
        break;
      case 1:
        bio = { ...bio, nama: current };
        break;
      case 2:
        bio = { ...bio, fakultas: current.substr(19, current.length) };
        break;
      case 3:
        bio = { ...bio, jurusan: current.substr(7, current.length) };
        break;
      case 4:
        bio = { ...bio, prodi: current.substr(13, current.length) };
        break;
      case 5:
        bio = { ...bio, seleksi: current.substr(7, current.length) };
        break;
      default:
        break;
    }
  });

  bio = { ...bio, status: status };

  return bio;
}
