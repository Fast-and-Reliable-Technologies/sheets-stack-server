const request = require("supertest");
const app = require("../app");
const testData = require("./basicdb.test-data.json");

const ID_QUERY_PARAMS = {
  spreadsheetId: "1tPc2W9ZXRY7dy4q5UQYUv4TZ0GGSkdxs29FMlJGZy10",
  sheetName: "basicdb",
};

const WRITE_QUERY_PARAMS = {
  spreadsheetId: "1tPc2W9ZXRY7dy4q5UQYUv4TZ0GGSkdxs29FMlJGZy10",
  sheetName: "writedb",
};

const paginationQueryParams = (limit, offset) => ({
  ...ID_QUERY_PARAMS,
  limit,
  offset,
});

describe("Basic DB /db/v1", () => {
  test("GET /db/v1/headers", () => {
    return request(app)
      .get("/db/v1/headers")
      .query(ID_QUERY_PARAMS)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(testData.headers);
      });
  });
  test("GET /db/v1/meta", () => {
    return request(app)
      .get("/db/v1/meta")
      .query(ID_QUERY_PARAMS)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(testData.meta);
      });
  });
  test("GET /db/v1/read/:_row", () => {
    return request(app)
      .get("/db/v1/read/3")
      .query(ID_QUERY_PARAMS)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(testData.read[1]);
      });
  });
  test("GET /db/v1/read", () => {
    return request(app)
      .get("/db/v1/read")
      .query(ID_QUERY_PARAMS)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(testData.read);
      });
  });
  test("GET /db/v1/read + pagination", () => {
    const expected = [testData.read[1], testData.read[2]];
    return request(app)
      .get("/db/v1/read")
      .query(paginationQueryParams(2, 1))
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(expected);
      });
  });
  test("GET /db/v1/search + filter", () => {
    const expected = [testData.read[1], testData.read[2]];
    return request(app)
      .post("/db/v1/search")
      .send({
        query: { id: { $gt: 1, $lte: 3 } },
      })
      .query(paginationQueryParams(2, 1))
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(expected);
      });
  });
  test("GET /db/v1/search + sort", () => {
    const expected = [
      testData.read[0],
      testData.read[3],
      testData.read[2],
      testData.read[1],
    ];
    return request(app)
      .post("/db/v1/search")
      .send({
        sort: ["isAdmin", "name"],
        sortDesc: true,
      })
      .query(paginationQueryParams(2, 1))
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(expected);
      });
  });
  test("POST /db/v1/ - Insert Record", () => {
    const id = Math.trunc(Math.random() * 1000);
    const expected = {
      email: `unit-test-user${id}@example.com`,
      id,
      isAdmin: !!(id & 1),
      name: `unit-test-user${id}`,
    };
    return request(app)
      .post("/db/v1/")
      .send(expected)
      .query(WRITE_QUERY_PARAMS)
      .expect(200)
      .then((res) => {
        const actual = {
          ...res.body,
          _row: undefined,
        };
        expect(actual).toEqual(expected);
      });
  });
  test("PUT /db/v1/ - Update Record", async () => {
    const _row = 4;
    const id = Math.trunc(Math.random() * 1000);
    const expected = {
      _row,
      email: `unit-test-user${id}@example.com`,
      id,
      isAdmin: !!(id & 1),
      name: `unit-test-user${id}`,
    };

    const updateResult = await request(app)
      .put(`/db/v1/${_row}`)
      .send(expected)
      .query(WRITE_QUERY_PARAMS)
      .expect(200);
    expect(updateResult.body).toEqual(true);
    return request(app)
      .get(`/db/v1/read/${_row}`)
      .query(WRITE_QUERY_PARAMS)
      .expect(200)
      .then((res) => {
        const actual = res.body;
        expect(actual).toEqual(expected);
      });
  });
});
