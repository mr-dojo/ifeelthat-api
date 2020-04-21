const ShareService = {
  getShares(knexInstance) {
    return knexInstance("share").select("*");
  },
  getShareById(knexInstance, id) {
    return knexInstance.from("share").select("*").where("id", id).first();
  },
  getSharesByEmotion(knexInstance, emotion) {
    return knexInstance.from("share").select("*").where("emotion", emotion);
  },
  insertShare(knexInstance, newShare) {
    return knexInstance
      .insert(newShare)
      .into("share")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updateShare(knexInstance, id, newShareDetails) {
    return knexInstance("share")
      .where({ id })
      .update(newShareDetails)
      .then(() => {
        return knexInstance("share").where({ id });
      });
  },
  deleteShare(knexInstance, id) {
    return knexInstance.from("share").where({ id }).delete();
  },
};

module.exports = ShareService;
