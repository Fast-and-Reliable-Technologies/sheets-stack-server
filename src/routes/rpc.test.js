const request = require("supertest");
const app = require("../app");
const testData = require("./rpc.test-data.json");

const ID_QUERY_PARAMS = {
  spreadsheetId: "1tPc2W9ZXRY7dy4q5UQYUv4TZ0GGSkdxs29FMlJGZy10",
};

describe("/rpc", () => {
  test("GET /rpc/meta", () => {
    return request(app)
      .get("/rpc/meta")
      .query(ID_QUERY_PARAMS)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(testData.meta);
      });
  });
});
