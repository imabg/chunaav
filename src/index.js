const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

require("./db");
const config = require("./config");
const routes = require("./api/routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(routes);

app.listen(config.SERVER_PORT, function (err) {
  if (err) console.error(err);
  console.log(`Server is running ... 🦄`);
});
