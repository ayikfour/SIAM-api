import dotenv from "dotenv";
let CONFIG = {};

CONFIG.port = process.env.PORT || "3000";

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || "babikudahitam";
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || "2h";

export default CONFIG;
