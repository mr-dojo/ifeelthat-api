const app = require("../src/app");
const knex = require("knex");
const { makeTestInput } = require("./feeling.fixtures");

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
      const { testFeelings } = makeTestInput();

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

  describe("POST /feeling", () => {
    const { testInvalidInput, testValidInput } = makeTestInput();

    it("If given invalid req data, responds with 422 and error message", () => {
      return supertest(app)
        .post("/feeling")
        .send(testInvalidInput)
        .expect(422, { error: { message: `Invalid input data` } });
    });

    it("If given valid req data, responds with 200 and created item", () => {
      return supertest(app)
        .post("/feeling")
        .send(testValidInput)
        .expect(201, testValidInput);
    });
  });

  describe(`GET /feeling/:id`, () => {
    context(`Given no items`, () => {
      it(`responds with 404`, () => {
        const feelingId = 123456;
        return supertest(app)
          .get(`/feeling/${feelingId}`)
          .expect(404, {
            error: { message: `Feeling with that id doesn't exist` }
          });
      });
    });

    context("Given there are rows in the database", () => {
      const { testFeelings } = makeTestInput();

      beforeEach("insert feelings", () => {
        return db.into("feeling").insert(testFeelings);
      });

      it("GET /feeling/:id responds with 200 and the specified item", () => {
        const feelingId = 2;
        const expectedItem = testFeelings[feelingId - 1];
        return supertest(app)
          .get(`/feeling/${feelingId}`)
          .expect(200, expectedItem);
      });
    });
  });

  describe("PATCH /feelings/:id", () => {
    const { testFeelings, testFeelingsUpdate } = makeTestInput();
    context(`Given no items`, () => {
      it(`responds with 404`, () => {
        const feelingId = 123456;
        return supertest(app)
          .patch(`/feeling/${feelingId}`)
          .send(testFeelingsUpdate)
          .expect(404, {
            error: { message: `Feeling with that id doesn't exist` }
          });
      });
    });

    context("Given there are rows in the database", () => {
      beforeEach("insert feelings", () => {
        return db.into("feeling").insert(testFeelings);
      });

      it("PATCH /feeling/:id responds with 202 and the updated feeling", () => {
        const feelingId = 2;
        return supertest(app)
          .patch(`/feeling/${feelingId}`)
          .send(testFeelingsUpdate)
          .expect(202, testFeelingsUpdate);
      });
    });
  });

  describe("DELETE /feeling/:id", () => {
    const { testFeelings } = makeTestInput();

    context(`Given no items`, () => {
      it(`responds with 404`, () => {
        const feelingId = 123456;
        return supertest(app)
          .delete(`/feeling/${feelingId}`)
          .expect(404, {
            error: { message: `Feeling with that id doesn't exist` }
          });
      });
    });
    context("Given there are rows in the database", () => {
      beforeEach("insert feelings", () => {
        return db.into("feeling").insert(testFeelings);
      });

      it("DELETE /feeling/:id responds with 204", () => {
        const feelingId = 2;
        return supertest(app)
          .delete(`/feeling/${feelingId}`)
          .expect(204);
      });
    });
  });
});
