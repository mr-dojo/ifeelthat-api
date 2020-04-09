const express = require("express");
const ShareService = require("./share-service");

const ShareRouter = express.Router();
const jsonParser = express.json();

ShareRouter.route("/")
  .get((req, res, next) => {
    ShareService.getShares(req.app.get("db"))
      .then((shares) => {
        res.send(200, shares);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { audio_share, text_share, share_type, feeling_id } = req.body;
    const newShare = { audio_share, text_share, share_type, feeling_id };

    if (audio_share && typeof audio_share !== "string") {
      return res.status(422).json({ error: { message: `Invalid input data` } });
    }
    if (text_share && typeof text_share !== "string") {
      return res.status(422).json({ error: { message: `Invalid input data` } });
    }
    if (share_type !== "Audio" && share_type !== "Text") {
      return res.status(422).json({
        error: { message: `share_type must be either "Audio" or "Text` },
      });
    }

    // FUTURE: impliment if checker for feeling_id

    ShareService.insertShare(req.app.get("db"), newShare)
      .then((createdItem) => {
        res.status(201).json(createdItem);
      })
      .catch(next);
  });

// feelingRouter
//   .route("/:id")
//   .all((req, res, next) => {
//     FeelingService.getFeelingById(req.app.get("db"), req.params.id)
//       .then((feeling) => {
//         if (!feeling) {
//           return res.status(404).json({
//             error: { message: `Feeling with that id doesn't exist` },
//           });
//         }
//         res.feeling = feeling;
//         next();
//       })
//       .catch(next);
//   })
//   .get((req, res, next) => res.status(200).json(res.feeling))
//   .patch(jsonParser, (req, res, next) => {
//     const { emotion, color } = req.body;
//     const newFeelingDetails = { emotion, color };

//     if (emotion === undefined && color === undefined) {
//       return res.status(400).json({ error: { message: `Invalid input data` } });
//     }

//     FeelingService.updateFeeling(
//       req.app.get("db"),
//       req.params.id,
//       newFeelingDetails
//     )
//       .then((updatedItem) => {
//         res.status(202).send(updatedItem[0]);
//       })
//       .catch(next);
//   })
//   .delete(jsonParser, (req, res, next) => {
//     FeelingService.deleteFeeling(req.app.get("db"), req.params.id).then((r) => {
//       res.status(204).end();
//     });
//   });

module.exports = ShareRouter;
