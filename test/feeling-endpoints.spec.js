const app = require("../src/app");
const knex = require("knex");

describe("feeling endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => {
    return Promise.all([
      db.raw(`TRUNCATE TABLE feeling RESTART IDENTITY CASCADE`)
    ]);
  });

  afterEach("cleanup", () => {
    return Promise.all([
      db.raw(`TRUNCATE TABLE feeling RESTART IDENTITY CASCADE`)
    ]);
  });

  describe("GET /feeling", () => {
    context("Given the feeling table is empty", () => {
      it("GET /feeling respondes with 200 and an empty array", () => {
        return supertest(app)
          .get("/feeling")
          .expect(200, []);
      });
    });

    context("Given the feeling table has rows", () => {
      let testFeelings = [
        {
          id: 1,
          emotion: "Anger",
          color: "Blue"
        },
        {
          id: 2,
          emotion: "Guilt",
          color: "Orange"
        }
      ];

      beforeEach("insert items", () => {
        return db.into("feeling").insert(testFeelings);
      });

      it("GET /feeling respondes with 200 and an array of feeling objects", () => {
        return supertest(app)
          .get("/feeling")
          .expect(200, testFeelings);
      });
    });
  });
});
