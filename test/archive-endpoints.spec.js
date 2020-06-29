const app = require("../src/app");
const knex = require("knex");
const { makeTestShareInput } = require("./share.fixtures");
const { makeTestInput } = require("./feeling.fixtures");
const { expect } = require("chai");

describe("archive endpoints", () => {
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
    await db.raw(`TRUNCATE TABLE archive RESTART IDENTITY CASCADE`);
    await db.raw(`TRUNCATE TABLE feeling RESTART IDENTITY CASCADE`);
  });

  afterEach("cleanup", async () => {
    await db.raw(`TRUNCATE TABLE archive RESTART IDENTITY CASCADE`);
    await db.raw(`TRUNCATE TABLE feeling RESTART IDENTITY CASCADE`);
  });

  describe("GET /archive", () => {
    context("Given the archive table is empty", () => {
      it("GET /archive respondes with 200 and an empty array", () => {
        return supertest(app).get("/archive").expect(200, []);
      });
    });

    context("Given the pending table has rows", () => {
      const { testFeelings } = makeTestInput();
      const { testShare } = makeTestShareInput();

      beforeEach("insert items", async () => {
        await db.into("feeling").insert(testFeelings);
        await db.into("archive").insert(testShare);
      });

      it("GET /archive respondes with 200 and an array of share objects", () => {
        return supertest(app).get("/archive").expect(200, testShare);
      });
    });
  });

  describe("POST /archive", () => {
    const { invalidTestShareInput, validTestShareInput } = makeTestShareInput();

    it("If given invalid req data, responds with 422 and error message", () => {
      return supertest(app)
        .post("/archive")
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
        .post("/archive")
        .send(validTestShareInput)
        .expect(201, validTestShareInput);
    });
  });
});
