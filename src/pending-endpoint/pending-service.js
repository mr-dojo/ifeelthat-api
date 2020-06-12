const PendingService = {
  getAllPending(knexInstance) {
    return knexInstance("pending").select("*");
  },
  getPendingById(knexInstance, id) {
    return knexInstance.from("pending").select("*").where("id", id).first();
  },
  insertPending(knexInstance, newPending) {
    return knexInstance
      .insert(newPending)
      .into("pending")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deletePendingById(knexInstance, id) {
    return knexInstance.from("pending").where({ id }).delete();
  },
};

module.exports = PendingService;
