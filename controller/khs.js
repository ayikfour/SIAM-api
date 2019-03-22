import cheerio from "cheerio";
import Browser from "./browser";

async function init(cookies) {
  const url = "https://siam.ub.ac.id/khs.php";
  const { page, browser } = await Browser();

  await page.setCookie(cookies);
  await page.goto(url);
  await page.waitForSelector("select[name='smtView']");
  const option = await page.$$("select[name='smtView'] > option");

  return { semester: option.length, browser, page };
}

export async function Khs(req, res) {
  try {
    const cookies = req.auth.cookies[1];
    const { semester, browser } = await init(cookies);
    browser.close();

    res.json({ semester });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getKhs(req, res) {
  try {
    const params = req.params.semester;
    const cookies = req.auth.cookies[1];
    const { semester, page, browser } = await init(cookies);

    if (params > semester || params < 1) {
      res.status(400).send("invalid semester");
      return;
    }

    await page.select("select[name='smtView']", params);
    await page.click("input[name='view']");
    await page.waitForSelector("table[width='515'] tbody");

    const content = await page.content();
    const khs = await scrapeKhs(content);

    browser.close();
    res.json({ semester: params, ...khs });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function scrapeKhs(content) {
  const $ = cheerio.load(content);

  const column = $('table[width="515"] tbody tr.text');
  let khs = column
    .map((i, matkul) => {
      if (i !== column.length - 1) {
        return split(matkul, $);
      }
    })
    .get();

  const ipcontainer = $("tr.text td");
  let ip = ipcontainer
    .map((i, el) => {
      if ($(el).text() === "IP Lulus") {
        let text = $(el)
          .next()
          .text();
        return text.substr(2);
      }
    })
    .get();

  return { khs, ip: ip[0], ipk: ip[1] };
}

function split(matkul, $) {
  let data = {};

  let child = $(matkul).children();

  child.each((i, el) => {
    let current = $(el).text();
    switch (i) {
      case 1:
        data = { ...data, kode: current };
        break;
      case 2:
        data = { ...data, matakuliah: current.substring(2, current.length) };
        break;
      case 3:
        data = { ...data, sks: current };
        break;
      case 4:
        data = { ...data, nilai: current };
        break;
      default:
        break;
    }
  });

  return data;
}
