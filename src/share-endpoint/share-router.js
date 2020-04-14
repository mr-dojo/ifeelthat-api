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

ShareRouter.route("/find").get((req, res, next) => {
  const emotion = req.query.emotion;
  const position = req.query.position;
  ShareService.getSharesByEmotion(req.app.get("db"), emotion, position)
    .then((shares) => {
      if (!shares.length) {
        return res.status(404).json({
          error: {
            message: `No shares with that emotion/position where found`,
          },
        });
      }
      return shares;
    })
    .then((shares) => {
      res.status(200).send(shares);
    })
    .catch(next);
});

ShareRouter.route("/:id")
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

module.exports = ShareRouter;
