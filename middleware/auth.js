import jwt from "jsonwebtoken";
import config from "../config/config";

export default function Auth(req, res, next) {
  const bearer = req.headers["authorization"];
  if (!bearer) {
    return res.status(403).send({ auth: false, message: "No token" });
  }

  const token = bearer.split(" ");

  jwt.verify(token[1], config.jwt_encryption, (err, decode) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({ auth: false, message: "Authentication failed" });
    }

    req.auth = decode;
    next();
  });
}
