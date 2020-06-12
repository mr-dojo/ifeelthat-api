const express = require("express");
const PendingService = require("./pending-service");

const PendingRouter = express.Router();
const jsonParser = express.json();

PendingRouter.route("/")
  .get((req, res, next) => {
    PendingService.getAllPending(req.app.get("db"))
      .then((pendingShares) => {
        res.send(200, pendingShares);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      audio_share,
      text_share,
      share_type,
      feeling_id,
      emotion,
    } = req.body;
    const newPendingShare = {
      audio_share,
      text_share,
      share_type,
      feeling_id,
      emotion,
    };

    if (audio_share && typeof audio_share !== "string") {
      return res.status(422).json({ error: { message: `Invalid input data` } });
    }
    if (text_share && typeof text_share !== "string") {
      return res.status(422).json({ error: { message: `Invalid input data` } });
    }
    if (share_type !== "Audio" && share_type !== "Text") {
      return res.status(422).json({
        error: { message: `share_type must be either "Audio" or "Text"` },
      });
    }

    // FUTURE: impliment if checker for feeling_id

    PendingService.insertPending(req.app.get("db"), newPendingShare)
      .then((createdItem) => {
        res.status(201).json(createdItem);
      })
      .catch(next);
  });

PendingRouter.route("/:id")
  .all((req, res, next) => {
    PendingService.getPendingById(req.app.get("db"), req.params.id)
      .then((pendingShare) => {
        if (!pendingShare) {
          return res.status(404).json({
            error: { message: `Pending share with that id doesn't exist` },
          });
        }
        res.pendingShare = pendingShare;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => res.status(200).json(res.pendingShare))
  .delete(jsonParser, (req, res, next) => {
    PendingService.deletePendingById(req.app.get("db"), req.params.id).then(
      (r) => {
        res.status(204).end();
      }
    );
  });

module.exports = PendingRouter;
