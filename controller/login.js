import Portal from "./portal";
import jwt from "jsonwebtoken";
import config from "../config/config";

export default async function Login(req, res) {
  try {
    const auth = req.body;
    const { page, browser } = await Portal(auth);
    const cookies = await page.cookies();

    browser.close();

    if (cookies.length > 1) {
      const token = jwt.sign(
        { username: auth.username, password: auth.password, cookies: cookies },
        config.jwt_encryption,
        { expiresIn: config.jwt_expiration }
      );
      res.send({ token });
    } else {
      res.status(401).send({ message: "unauthenticated" });
    }
  } catch (error) {
    console.log(error);
  }
}
