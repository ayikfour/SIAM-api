import Browser from "./browser";

// Base URL for siam

export default async function Portal(auth) {
  const url = "https://siam.ub.ac.id/";
  try {
    const { page, browser } = await Browser();

    await page.goto(url);
    await page.waitForSelector("input");

    const usernameInput = await page.$("input[name='username']");
    const passwordInput = await page.$("input[name='password']");
    const button = await page.$("input[name='login']");

    await usernameInput.type(auth.username);
    await passwordInput.type(auth.password);
    await button.click();

    await page.waitForNavigation();

    //returning page and browser
    return { page, browser };
  } catch (error) {
    console.log(error);
  }
}
