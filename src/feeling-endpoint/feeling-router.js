const express = require("express");
const FeelingService = require("./feeling-service");

const feelingRouter = express.Router();
const jsonParser = express.json();

feelingRouter
  .route("/")
  .get((req, res, next) => {
    FeelingService.getFeelings(req.app.get("db"))
      .then((feelings) => {
        res.status(200).send(feelings);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { emotion, color } = req.body;
    const newFeeling = { emotion, color };

    if (color !== undefined && typeof color !== "string") {
      return res.status(422).json({ error: { message: `Invalid input data` } });
    }
    if (emotion !== undefined && typeof emotion !== "string") {
      return res.status(422).json({ error: { message: `Invalid input data` } });
    }

    FeelingService.insertFeeling(req.app.get("db"), newFeeling)
      .then((createdItem) => {
        res.status(201).json(createdItem);
      })
      .catch(next);
  });

feelingRouter
  .route("/:id")
  .all((req, res, next) => {
    FeelingService.getFeelingById(req.app.get("db"), req.params.id)
      .then((feeling) => {
        if (!feeling) {
          return res.status(404).json({
            error: { message: `Feeling with that id doesn't exist` },
          });
        }
        res.feeling = feeling;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => res.status(200).json(res.feeling))
  .patch(jsonParser, (req, res, next) => {
    const { emotion, color } = req.body;
    const newFeelingDetails = { emotion, color };

    if (emotion === undefined && color === undefined) {
      return res.status(400).json({ error: { message: `Invalid input data` } });
    }

    FeelingService.updateFeeling(
      req.app.get("db"),
      req.params.id,
      newFeelingDetails
    )
      .then((updatedItem) => {
        res.status(202).send(updatedItem[0]);
      })
      .catch(next);
  })
  .delete(jsonParser, (req, res, next) => {
    FeelingService.deleteFeeling(req.app.get("db"), req.params.id).then((r) => {
      res.status(204).end();
    });
  });

module.exports = feelingRouter;
