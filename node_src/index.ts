import express from "express";
const { Model } = require("objection");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const cookieSession = require("cookie-session");
import router from "./routes";
const knex = require("./config/db");
const keys = require("./config/keys");
const errHandler = require("./middleware/errHandler");
require("./services/passport");

const DEFAULT_PORT = 5000;

const app = express()
  .use(bodyParser.json())
  .use(
    cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: [keys.cookieKey] })
  )
  .use(morgan("combined"))
  .use(passport.initialize())
  .use(passport.session())
  .use(router)
  .use(errHandler);

Model.knex(knex);

const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);
