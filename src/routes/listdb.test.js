const request = require("supertest");
const app = require("../app");
const testData = require("./listdb.test-data.json");

const ID_QUERY_PARAMS = {
  spreadsheetId: "1tPc2W9ZXRY7dy4q5UQYUv4TZ0GGSkdxs29FMlJGZy10",
  sheetName: "listsdb",
};

describe("/listdb", () => {
  test("GET /listdb/titles", () => {
    return request(app)
      .get("/listdb/titles")
      .query(ID_QUERY_PARAMS)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(testData.titles);
      });
  });
  test("GET /listdb/meta", () => {
    return request(app)
      .get("/listdb/meta")
      .query(ID_QUERY_PARAMS)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(testData.meta);
      });
  });
  test("GET /listdb/read", () => {
    return request(app)
      .get("/listdb/read")
      .query(ID_QUERY_PARAMS)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(testData.read);
      });
  });
});
