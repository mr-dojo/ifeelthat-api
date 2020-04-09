const app = require("../src/app");
const knex = require("knex");
const { makeTestShareInput } = require("./share.fixtures");
const { makeTestInput } = require("./feeling.fixtures");

describe("share endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => {
    return Promise.all([
      db.raw(`TRUNCATE TABLE share RESTART IDENTITY CASCADE`),
      db.raw(`TRUNCATE TABLE feeling RESTART IDENTITY CASCADE`),
    ]);
  });

  afterEach("cleanup", () => {
    return Promise.all([
      db.raw(`TRUNCATE TABLE share RESTART IDENTITY CASCADE`),
      db.raw(`TRUNCATE TABLE feeling RESTART IDENTITY CASCADE`),
    ]);
  });

  describe("GET /share", () => {
    context("Given the share table is empty", () => {
      it("GET /share respondes with 200 and an empty array", () => {
        return supertest(app).get("/share").expect(200, []);
      });
    });

    context("Given the share table has rows", () => {
      const { testFeelings } = makeTestInput();
      const { testShare } = makeTestShareInput();

      beforeEach("insert items", () => {
        return Promise.all([
          db.into("feeling").insert(testFeelings),
          db.into("share").insert(testShare),
        ]);
      });

      it("GET /share respondes with 200 and an array of share objects", () => {
        return supertest(app).get("/share").expect(200, testShare);
      });
    });
  });

  describe("POST /share", () => {
    const { invalidTestShareInput, validTestShareInput } = makeTestShareInput();

    it("If given invalid req data, responds with 422 and error message", () => {
      return supertest(app)
        .post("/share")
        .send(invalidTestShareInput)
        .expect(422, {
          error: { message: `share_type must be either "Audio" or "Text"` },
        });
    });

    const { testFeelings } = makeTestInput();

    beforeEach("insert items", () => {
      return db.into("feeling").insert(testFeelings);
    });

    it("If given valid req data, responds with 200 and created item", () => {
      return supertest(app)
        .post("/share")
        .send(validTestShareInput)
        .expect(201, validTestShareInput);
    });
  });

  // describe(`GET /feeling/:id`, () => {
  //   context(`Given no items`, () => {
  //     it(`responds with 404`, () => {
  //       const feelingId = 123456;
  //       return supertest(app)
  //         .get(`/feeling/${feelingId}`)
  //         .expect(404, {
  //           error: { message: `Feeling with that id doesn't exist` },
  //         });
  //     });
  //   });

  //   context("Given there are rows in the database", () => {
  //     const { testFeelings } = makeTestInput();

  //     beforeEach("insert feelings", () => {
  //       return db.into("feeling").insert(testFeelings);
  //     });

  //     it("GET /feeling/:id responds with 200 and the specified item", () => {
  //       const feelingId = 2;
  //       const expectedItem = testFeelings[feelingId - 1];
  //       return supertest(app)
  //         .get(`/feeling/${feelingId}`)
  //         .expect(200, expectedItem);
  //     });
  //   });
  // });

  // describe("PATCH /feelings/:id", () => {
  //   const { testFeelings, testFeelingsUpdate } = makeTestInput();
  //   context(`Given no items`, () => {
  //     it(`responds with 404`, () => {
  //       const feelingId = 123456;
  //       return supertest(app)
  //         .patch(`/feeling/${feelingId}`)
  //         .send(testFeelingsUpdate)
  //         .expect(404, {
  //           error: { message: `Feeling with that id doesn't exist` },
  //         });
  //     });
  //   });

  //   context("Given there are rows in the database", () => {
  //     beforeEach("insert feelings", () => {
  //       return db.into("feeling").insert(testFeelings);
  //     });

  //     it("PATCH /feeling/:id responds with 202 and the updated feeling", () => {
  //       const feelingId = 2;
  //       return supertest(app)
  //         .patch(`/feeling/${feelingId}`)
  //         .send(testFeelingsUpdate)
  //         .expect(202, testFeelingsUpdate);
  //     });
  //   });
  // });

  // describe("DELETE /feeling/:id", () => {
  //   const { testFeelings } = makeTestInput();

  //   context(`Given no items`, () => {
  //     it(`responds with 404`, () => {
  //       const feelingId = 123456;
  //       return supertest(app)
  //         .delete(`/feeling/${feelingId}`)
  //         .expect(404, {
  //           error: { message: `Feeling with that id doesn't exist` },
  //         });
  //     });
  //   });
  //   context("Given there are rows in the database", () => {
  //     beforeEach("insert feelings", () => {
  //       return db.into("feeling").insert(testFeelings);
  //     });

  //     it("DELETE /feeling/:id responds with 204", () => {
  //       const feelingId = 2;
  //       return supertest(app).delete(`/feeling/${feelingId}`).expect(204);
  //     });
  //   });
  // });
});
