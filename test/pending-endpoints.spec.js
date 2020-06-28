const app = require("../src/app");
const knex = require("knex");
const { makeTestShareInput } = require("./share.fixtures");
const { makeTestInput } = require("./feeling.fixtures");
const { expect } = require("chai");

describe("pending endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", async () => {
    await db.raw(`TRUNCATE TABLE pending RESTART IDENTITY CASCADE`);
    await db.raw(`TRUNCATE TABLE share RESTART IDENTITY CASCADE`);
    await db.raw(`TRUNCATE TABLE feeling RESTART IDENTITY CASCADE`);
  });

  afterEach("cleanup", async () => {
    await db.raw(`TRUNCATE TABLE pending RESTART IDENTITY CASCADE`);
    await db.raw(`TRUNCATE TABLE share RESTART IDENTITY CASCADE`);
    await db.raw(`TRUNCATE TABLE feeling RESTART IDENTITY CASCADE`);
  });

  describe("GET /pending", () => {
    context("Given the pending table is empty", () => {
      it("GET /pending respondes with 200 and an empty array", () => {
        return supertest(app).get("/pending").expect(200, []);
      });
    });

    context("Given the pending table has rows", () => {
      const { testFeelings } = makeTestInput();
      const { testShare } = makeTestShareInput();

      beforeEach("insert items", async () => {
        await db.into("feeling").insert(testFeelings);
        await db.into("pending").insert(testShare);
      });

      it("GET /pending respondes with 200 and an array of share objects", () => {
        return supertest(app).get("/pending").expect(200, testShare);
      });
    });
  });

  describe("POST /pending", () => {
    const { invalidTestShareInput, validTestShareInput } = makeTestShareInput();

    it("If given invalid req data, responds with 422 and error message", () => {
      return supertest(app)
        .post("/pending")
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
        .post("/pending")
        .send(validTestShareInput)
        .expect(201, validTestShareInput);
    });
  });

  describe(`GET /pending/:id`, () => {
    context(`Given no items`, () => {
      it(`responds with 404`, () => {
        const shareId = 123456;
        return supertest(app)
          .get(`/pending/${shareId}`)
          .expect(404, {
            error: { message: `Pending share with that id doesn't exist` },
          });
      });
    });

    context("Given there are rows in the database", () => {
      const { testFeelings } = makeTestInput();
      const { testShare } = makeTestShareInput();

      beforeEach("insert items", async () => {
        await db.into("feeling").insert(testFeelings);
        await db.into("pending").insert(testShare);
      });

      it("GET /pending/:id responds with 200 and the specified item", () => {
        const shareId = 1;
        const expectedItem = testShare[shareId - 1];
        return supertest(app)
          .get(`/pending/${shareId}`)
          .expect(200, expectedItem);
      });
    });
  });

  describe("PATCH /pending/:id", () => {
    const { testShare, updateTestShareInput } = makeTestShareInput();
    const { testFeelings } = makeTestInput();
    context(`Given no items`, () => {
      it(`responds with 404 and correct error message`, () => {
        const pendingId = 123456;
        return supertest(app)
          .patch(`/pending/${pendingId}`)
          .send(updateTestShareInput)
          .expect(404, {
            error: { message: `Pending share with that id doesn't exist` },
          });
      });
    });

    context("Given there are rows in the database", () => {
      beforeEach("insert items", async () => {
        await db.into("feeling").insert(testFeelings);
        await db.into("pending").insert(testShare);
      });

      it("PATCH /pending/:id responds with 400 if not provided any valid update values", () => {
        const shareId = 1;
        return supertest(app)
          .patch(`/pending/${shareId}/?status=no`)
          .send({})
          .expect(422, {
            error: {
              message: `Request requires query parameter 'status' of either 'accept' or 'deny'`,
            },
          });
      });

      it("PATCH /pending/:id/?status=accept responds with 200 and responds with remaining pending shares", () => {
        const shareId = 1;
        return supertest(app)
          .patch(`/pending/${shareId}/?status=accept`)
          .expect(200, []);
      });

      it("PATCH /pending/:id/?status=accept adds pending share to share table", () => {
        const shareId = 1;
        return supertest(app)
          .patch(`/pending/${shareId}/?status=accept`)
          .then(async () => {
            const shareTableContent = await db.from("share").select("*");
            expect(shareTableContent).to.deep.equal(testShare);
          });
      });
    });
  });

  // describe("DELETE /share/:id", () => {
  //   context(`Given no items`, () => {
  //     it(`responds with 404`, () => {
  //       const shareId = 123456;
  //       return supertest(app)
  //         .delete(`/share/${shareId}`)
  //         .expect(404, {
  //           error: { message: `Share with that id doesn't exist` },
  //         });
  //     });
  //   });
  //   context("Given there are rows in the database", () => {
  //     const { testFeelings } = makeTestInput();
  //     const { testShare } = makeTestShareInput();

  //     beforeEach("insert items", async () => {
  //       await db.into("feeling").insert(testFeelings);
  //       await db.into("share").insert(testShare);
  //     });

  //     it("DELETE /share/:id responds with 204", () => {
  //       const shareId = 1;
  //       return supertest(app).delete(`/share/${shareId}`).expect(204);
  //     });
  //   });
  // });

  // describe("GET /share/find?emotion=Joy&position=0", () => {
  //   context(`Given no items`, () => {
  //     it(`responds with 404`, () => {
  //       return supertest(app)
  //         .get(`/share/find?emotion=Joy&position=0`)
  //         .expect(204);
  //     });
  //   });
  //   context("Given there are rows in the database", () => {
  //     const { testFeelings } = makeTestInput();
  //     const { testShare } = makeTestShareInput();
  //     const testShareWithColor = [
  //       {
  //         id: 1,
  //         audio_share: "testURLstring",
  //         text_share: null,
  //         emotion: "Joy",
  //         color: "Blue",
  //         feeling_id: 1,
  //         share_type: "Audio",
  //       },
  //     ];

  //     beforeEach("insert items", async () => {
  //       await db.into("feeling").insert(testFeelings);
  //       await db.into("share").insert(testShare);
  //     });

  //     it("GET /share/find?emotion=Joy&position=0 should respond with the first item with the emotion: 'Joy'", () => {
  //       return supertest(app)
  //         .get(`/share/find?emotion=Joy&position=0`)
  //         .expect(200, testShareWithColor);
  //     });
  //   });
  // });
});
