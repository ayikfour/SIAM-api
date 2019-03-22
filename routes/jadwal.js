import cheerio from "cheerio";
import Browser from "../config/browser";

export default async function Jadwal(req, res) {
  const url = "https://siam.ub.ac.id/class.php";

  try {
    const cookies = req.auth.cookies[1];
    const { page, browser } = await Browser();

    await page.setCookie(cookies);
    const response = await page.goto(url);
    await page.waitForSelector("td[bgcolor='#cccccc']");

    while (response.status() === 503) {
      response = await Promise.all([page.reload()]);
    }

    const content = await page.content();
    browser.close();
    const jadwal = await scrapeJadwal(content);
    res.json(jadwal);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function scrapeJadwal(content) {
  const $ = cheerio.load(content);
  let jadwal = [];

  $('table[width="650"] tbody').each((i, value) => {
    $(value)
      .find("tr.text")
      .each((j, matkul) => {
        let current = splitMatkul(matkul, $);
        jadwal = [...jadwal, current];
      });
  });

  return { jadwal: jadwal };
}

// split matakuliah items from iteration
// based on case
function splitMatkul(matkul, $) {
  let matkulArray = {};
  $(matkul)
    .find("td")
    .each((i, attrib) => {
      let current = $(attrib).text();
      switch (i) {
        case 0:
          matkulArray = { ...matkulArray, hari: current };
          break;
        case 1:
          matkulArray = { ...matkulArray, jam: current };
          break;
        case 2:
          matkulArray = { ...matkulArray, kelas: current };
          break;
        case 3:
          matkulArray = { ...matkulArray, kode: current };
          break;
        case 4:
          matkulArray = {
            ...matkulArray,
            matakuliah: current.substring(2, current.length)
          };
          break;
        case 5:
          matkulArray = {
            ...matkulArray,
            tahun: current.substring(2, current.length)
          };
          break;
        case 7:
          matkulArray = { ...matkulArray, ruang: current };
          break;
      }
    });
  return matkulArray;
}
