const ArchiveService = {
  getAllArchived(knexInstance) {
    return knexInstance("archive").select("*");
  },
  getArchivedById(knexInstance, id) {
    return knexInstance.from("archive").select("*").where("id", id).first();
  },
  insertArchived(knexInstance, newArchive) {
    return knexInstance
      .insert(newArchive)
      .into("archive")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteArchivedById(knexInstance, id) {
    return knexInstance.from("archive").where({ id }).delete();
  },
};

module.exports = ArchiveService;
