const express = require("express");
const PendingService = require("./pending-service");
const ShareService = require("../share-endpoint/share-service");
const ArchiveService = require("../archive-endpoint/archive-service");
const { buildShareFromRequest } = require("../helper-functions");

const PendingRouter = express.Router();
const jsonParser = express.json();

PendingRouter.route("/")
  .get((req, res, next) => {
    PendingService.getAllPending(req.app.get("db"))
      .then((pendingShares) => {
        res.status(200).send(pendingShares);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const pendingShare = buildShareFromRequest(req.body);

    if (
      pendingShare.audio_share &&
      typeof pendingShare.audio_share !== "string"
    ) {
      return res.status(422).json({ error: { message: `Invalid input data` } });
    }
    if (
      pendingShare.text_share &&
      typeof pendingShare.text_share !== "string"
    ) {
      return res.status(422).json({ error: { message: `Invalid input data` } });
    }
    if (
      pendingShare.share_type !== "Audio" &&
      pendingShare.share_type !== "Text"
    ) {
      return res.status(422).json({
        error: { message: `share_type must be either "Audio" or "Text"` },
      });
    }

    PendingService.insertPending(req.app.get("db"), pendingShare)
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
  .patch(jsonParser, async (req, res, next) => {
    const status = req.query.status;

    if (status != "accept" && status != "deny") {
      res
        .status(422)
        .json({
          error: {
            message:
              "Request requires query parameter 'status' of either 'accept' or 'deny'",
          },
        })
        .end();
    } else {
      // remove the id from the pending share before inserting into new table to avoid conflict with duplicate id's
      delete res.pendingShare.id;
      if (status === "accept") {
        // Insert pending share to "share" table
        await ShareService.insertShare(
          req.app.get("db"),
          res.pendingShare
        ).catch(next);
      }

      if (status === "deny") {
        // Insert pending share to "archive" table
        await ArchiveService.insertArchived(
          req.app.get("db"),
          res.pendingShare
        ).catch(next);
      }

      // Delete pending share from "pending" table
      await PendingService.deletePendingById(
        req.app.get("db"),
        req.params.id
      ).catch(next);

      // Send all remaining pending shares
      await PendingService.getAllPending(req.app.get("db"))
        .then((pendingShares) => {
          res.status(201).send(pendingShares);
        })
        .catch(next);
    }
  })
  .delete(jsonParser, (req, res, next) => {
    PendingService.deletePendingById(req.app.get("db"), req.params.id).then(
      (r) => {
        res.status(204).end();
      }
    );
  });

module.exports = PendingRouter;
