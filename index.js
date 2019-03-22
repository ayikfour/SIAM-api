// npm dependencies
import express from "express";
import bodyParser from "body-parser";
import config from "./config/config";

// user defined modules
import Login from "./controller/login";
import Jadwal from "./controller/jadwal";
import Profile from "./controller/profile";
import { Khs, getKhs } from "./controller/khs";
import Absensi from "./controller/absensi";
import Auth from "./middleware/auth";

// routing start here
const app = express();
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.send("the fuck dude? login first");
});

app.post("/login", Login);
app.get("/jadwal", Auth, Jadwal);
app.get("/profile", Auth, Profile);
app.get("/khs", Auth, Khs);
app.get("/khs/:semester", Auth, getKhs);
app.get("/absensi", Auth, Absensi);

let port = config.port;
app.listen(port, () => {
  console.log(`you are running on port ${port}`);
});

export default app;
