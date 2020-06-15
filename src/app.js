require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const feelingRouter = require("./feeling-endpoint/feeling-router.js");
const shareRouter = require("./share-endpoint/share-router.js");
const pendingRouter = require("./pending-endpoint/pending-router.js");
const archiveRouter = require("./archive-endpoint/archive-router.js");
const { NODE_ENV, CLIENT_ORIGIN } = require("./config");

const app = express();

const morganSetting = NODE_ENV === "production" ? "tiny" : "dev";

app.use(morgan(morganSetting));
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);
app.use("/feeling", feelingRouter);
app.use("/share", shareRouter);
app.use("/pending", pendingRouter);
app.use("/archive", archiveRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "Server error" } };
  } else {
    response = { error: { message: error.message, error } };
  }
  console.log(error);
  res.status(500).json(response);
});

module.exports = app;
