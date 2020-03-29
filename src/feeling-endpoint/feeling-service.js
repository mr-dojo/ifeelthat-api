const FeelingService = {
  getFeelings(knexInstance) {
    return knexInstance("feeling").select("*");
  },
  getFeelingById(knexInstance, id) {
    return knexInstance
      .from("feeling")
      .select("*")
      .where("id", id)
      .first();
  },
  insertFeeling(knexInstance, newFeeling) {
    return knexInstance
      .insert(newFeeling)
      .into("feeling")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  updateFeeling(knexInstance, id, newFeelingDetails) {
    return knexInstance("feeling")
      .where({ id })
      .update(newFeelingDetails)
      .then(() => {
        return knexInstance("feeling").where({ id });
      });
  },
  deleteFeeling(knexInstance, id) {
    return knexInstance
      .from("feeling")
      .where({ id })
      .delete();
  }
};

module.exports = FeelingService;
