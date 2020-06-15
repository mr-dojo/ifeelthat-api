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

// ArchiveRouter.route("/:id")
//   .all((req, res, next) => {
//     ArchiveService.getShareById(req.app.get("db"), req.params.id)
//       .then((share) => {
//         if (!share) {
//           return res.status(404).json({
//             error: { message: `Share with that id doesn't exist` },
//           });
//         }
//         res.share = share;
//         next();
//       })
//       .catch(next);
//   })
//   .get((req, res, next) => res.status(200).json(res.share))
//   .patch(jsonParser, (req, res, next) => {
//     const { audio_share, text_share, share_type, feeling_id } = req.body;
//     const newShareDetails = { audio_share, text_share, share_type, feeling_id };

//     if (!audio_share && !text_share && !share_type && !feeling_id) {
//       return res.status(400).json({ error: { message: `Invalid input data` } });
//     }

//     ArchiveService.updateShare(
//       req.app.get("db"),
//       req.params.id,
//       newShareDetails1
//     )
//       .then((updatedItem) => {
//         res.status(202).send(updatedItem[0]);
//       })
//       .catch(next);
//   })
//   .delete(jsonParser, (req, res, next) => {
//     ArchiveService.deleteShare(req.app.get("db"), req.params.id).then((r) => {
//       res.status(204).end();
//     });
// });

module.exports = ArchiveRouter;
