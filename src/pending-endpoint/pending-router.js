const express = require("express");
const ShareService = require("../share-endpoint/share-service");
const PendingService = require("./pending-service");

const PendingRouter = express.Router();
const jsonParser = express.json();

PendingRouter.route("/")
  .get((req, res, next) => {
    ShareService.getShares(req.app.get("db"))
      .then((shares) => {
        res.send(200, shares);
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
    const newShare = {
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

    ShareService.insertShare(req.app.get("db"), newShare)
      .then((createdItem) => {
        res.status(201).json(createdItem);
      })
      .catch(next);
  });

PendingRouter.route("/find").get((req, res, next) => {
  const emotion = req.query.emotion;
  ShareService.getSharesByEmotion(req.app.get("db"), emotion)
    .then((shares) => {
      if (!shares.length) {
        return res.status(204).json();
      }
      // Get assosiated feeling.color and join with response data
      getShareColors(req.app.get("db"), shares, (completeShares) => {
        res.status(200).json(completeShares);
      });
    })
    .catch(next);
});

async function getShareColors(db, shares, cb) {
  const completeShares = [];
  for (share in shares) {
    let shareColor;
    await FeelingService.getFeelingById(db, shares[share].feeling_id)
      .then((feeling) => {
        if (!feeling) {
          return new Error({
            error: {
              message: `No feelings with that id where found`,
            },
          });
        }
        return feeling;
      })
      .then((feeling) => {
        shareColor = feeling.color;
      })
      .catch();
    completeShares.push({
      ...shares[share],
      color: shareColor,
    });
  }
  cb(completeShares);
}

PendingRouter.route("/:id")
  .all((req, res, next) => {
    ShareService.getShareById(req.app.get("db"), req.params.id)
      .then((share) => {
        if (!share) {
          return res.status(404).json({
            error: { message: `Share with that id doesn't exist` },
          });
        }
        res.share = share;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => res.status(200).json(res.share))
  .patch(jsonParser, (req, res, next) => {
    const { audio_share, text_share, share_type, feeling_id } = req.body;
    const newShareDetails = { audio_share, text_share, share_type, feeling_id };

    if (!audio_share && !text_share && !share_type && !feeling_id) {
      return res.status(400).json({ error: { message: `Invalid input data` } });
    }

    ShareService.updateShare(req.app.get("db"), req.params.id, newShareDetails)
      .then((updatedItem) => {
        res.status(202).send(updatedItem[0]);
      })
      .catch(next);
  })
  .delete(jsonParser, (req, res, next) => {
    ShareService.deleteShare(req.app.get("db"), req.params.id).then((r) => {
      res.status(204).end();
    });
  });

module.exports = PendingRouter;
