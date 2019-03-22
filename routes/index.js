import Login from "./login";
import Jadwal from "./jadwal";
import Profile from "./profile";
import Khs from "./khs";
import Absensi from "./absensi";
import Auth from "../middleware/auth";

export default function routes(app) {
  app.get("/", (req, res) => {
    res.status(200).send({ message: "An API to retrieve data from SIAM UB" });
  });

  app.post("/login", Login);

  app.get("/jadwal", Auth, Jadwal);

  app.get("/profile", Auth, Profile);

  app.get("/khs", Auth, Khs.khs);

  app.get("/khs/:semester", Auth, Khs.getKhs);

  app.get("/absensi", Auth, Absensi);
}
