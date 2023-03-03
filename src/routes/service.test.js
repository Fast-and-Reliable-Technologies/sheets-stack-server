const request = require("supertest");
const app = require("../app");

describe("/services", () => {
  test("GET /service/ping", () => {
    return request(app)
      .get("/service/ping")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual("pong");
      });
  });
  test("GET /service/info", () => {
    return request(app)
      .get("/service/info")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          name: "@de44/sheets-stack-server",
          version: "1.0.2",
          description:
            "Express JS routes to expose simplify interactions with Google Sheets.",
        });
      });
  });
});
