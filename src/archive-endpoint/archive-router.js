const express = require("express");
const ArchiveService = require("../archive-endpoint/archive-service");
const { buildShareFromRequest } = require("../helper-functions");

const ArchiveRouter = express.Router();
const jsonParser = express.json();

ArchiveRouter.route("/")
  .get((req, res, next) => {
    ArchiveService.getAllArchived(req.app.get("db"))
      .then((allArchivedShares) => {
        res.status(200).send(allArchivedShares);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const newArchivedShare = buildShareFromRequest(req.body);

    if (
      newArchivedShare.audio_share &&
      typeof newArchivedShare.audio_share !== "string"
    ) {
      return res.status(422).json({ error: { message: `Invalid input data` } });
    }
    if (
      newArchivedShare.text_share &&
      typeof newArchivedShare.text_share !== "string"
    ) {
      return res.status(422).json({ error: { message: `Invalid input data` } });
    }
    if (
      newArchivedShare.share_type !== "Audio" &&
      newArchivedShare.share_type !== "Text"
    ) {
      return res.status(422).json({
        error: { message: `share_type must be either "Audio" or "Text"` },
      });
    }

    // FUTURE: impliment if checker for feeling_id

    ArchiveService.insertArchived(req.app.get("db"), newArchivedShare)
      .then((createdItem) => {
        res.status(201).json(createdItem);
      })
      .catch(next);
  });

module.exports = ArchiveRouter;
