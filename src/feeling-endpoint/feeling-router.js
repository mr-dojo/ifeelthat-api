const express = require("express");
const FeelingService = require("./feeling-service");

const feelingRouter = express.Router();
const jsonParser = express.json();

feelingRouter.route("/").get((req, res, next) => {
  FeelingService.getFeelings(req.app.get("db"))
    .then(feelings => {
      res.send(200, feelings);
    })
    .catch(next);
});

module.exports = feelingRouter;
