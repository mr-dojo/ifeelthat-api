const app = require("../src/app");

describe("feeling endpoints", () => {
  it('GET /feeling respondes with 200 and "return all feelings"', () => {
    return supertest(app)
      .get("/feeling")
      .expect(200, "return all feelings");
  });
});
