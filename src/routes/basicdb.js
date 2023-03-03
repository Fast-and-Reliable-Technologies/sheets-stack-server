// @ts-check
const _ = require("lodash");
const express = require("express");
const createError = require("http-errors");
const {
  logging: { logger },
  sheets: { getAuth, getSheetsClient, SpreadsheetsClient },
  BasicDatabase,
} = require("@de44/sheets-stack-core");

const router = express.Router();

const NUMBER_PATTERN = /^-?[0-9]+(?:\.[0-9]+)?$/;
/**
 *
 * @param {any} val
 * @param {number} [defaultValue]
 * @returns {number | undefined}
 */
const toNumber = (val, defaultValue = undefined) => {
  if (_.isNumber(val)) return Number(val);
  if (_.isNil(val)) return defaultValue;
  val = val.toString();
  if (NUMBER_PATTERN.test(val)) return Number(val);
  return defaultValue;
};
const toString = (val, defaultValue = undefined) => {
  if (_.isString(val)) return val;
  if (!_.isNil(val)) return val.toString();
  return defaultValue;
};

async function getDb() {
  const auth = getAuth();
  const sheetsCli = await getSheetsClient(auth);
  const cli = new SpreadsheetsClient(sheetsCli, logger);
  return new BasicDatabase(cli);
}

const dbP = getDb();

router.get("/headers", async (req, res, next) => {
  const spreadsheetId = toString(req.query.spreadsheetId);
  const sheetName = toString(req.query.sheetName);
  if (_.isNil(spreadsheetId))
    return next(createError(400, "Missing `spreadsheetId`"));
  if (_.isNil(sheetName)) return next(createError(400, "Missing `sheetName`"));
  const db = await dbP;
  const titles = await db.getHeaders(spreadsheetId, sheetName);
  res.json(titles);
});

router.get("/meta", async (req, res, next) => {
  const spreadsheetId = toString(req.query.spreadsheetId);
  const sheetName = toString(req.query.sheetName);
  if (_.isNil(spreadsheetId))
    return next(createError(400, "Missing `spreadsheetId`"));
  if (_.isNil(sheetName)) return next(createError(400, "Missing `sheetName`"));
  const db = await dbP;
  const meta = await db.getMeta(spreadsheetId, sheetName);
  res.json(meta);
});

router.get("/read/:_row", async (req, res, next) => {
  const _row = toNumber(req.params._row, undefined);
  if (_.isNil(_row)) return next(createError(400, "Invalid row number"));
  const spreadsheetId = toString(req.query.spreadsheetId);
  const sheetName = toString(req.query.sheetName);
  if (_.isNil(spreadsheetId))
    return next(createError(400, "Missing `spreadsheetId`"));
  if (_.isNil(sheetName)) return next(createError(400, "Missing `sheetName`"));
  const db = await dbP;
  const data = await db.get(spreadsheetId, sheetName, _row);
  res.json(data);
});

router.get("/read", async (req, res, next) => {
  const spreadsheetId = toString(req.query.spreadsheetId);
  const sheetName = toString(req.query.sheetName);
  if (_.isNil(spreadsheetId))
    return next(createError(400, "Missing `spreadsheetId`"));
  if (_.isNil(sheetName)) return next(createError(400, "Missing `sheetName`"));
  const limit = toNumber(req.query.limit);
  const offset = toNumber(req.query.offset);
  const db = await dbP;
  const data = await db.list(spreadsheetId, sheetName, {
    limit,
    offset,
  });
  res.json(data);
});

router.post("/search", async (req, res, next) => {
  const spreadsheetId = toString(req.query.spreadsheetId);
  const sheetName = toString(req.query.sheetName);
  if (_.isNil(spreadsheetId))
    return next(createError(400, "Missing `spreadsheetId`"));
  if (_.isNil(sheetName)) return next(createError(400, "Missing `sheetName`"));
  const { limit, offset, filter, query, sort, sortDesc } = req.body;
  const db = await dbP;
  const data = await db.search(spreadsheetId, sheetName, {
    limit,
    offset,
    filter,
    query,
    sort,
    sortDesc,
  });
  res.json(data);
});

router.post("/", async (req, res, next) => {
  const spreadsheetId = toString(req.query.spreadsheetId);
  const sheetName = toString(req.query.sheetName);
  if (_.isNil(spreadsheetId))
    return next(createError(400, "Missing `spreadsheetId`"));
  if (_.isNil(sheetName)) return next(createError(400, "Missing `sheetName`"));
  const db = await dbP;
  const result = await db.insert(spreadsheetId, sheetName, req.body);
  res.json(_.get(result, "data[0]"));
});

router.put("/:_row", async (req, res, next) => {
  const spreadsheetId = toString(req.query.spreadsheetId);
  const sheetName = toString(req.query.sheetName);
  if (_.isNil(spreadsheetId))
    return next(createError(400, "Missing `spreadsheetId`"));
  if (_.isNil(sheetName)) return next(createError(400, "Missing `sheetName`"));
  const db = await dbP;
  /** @type {number} */
  // @ts-ignore
  const _row = toNumber(_.get(req, "params._row"), -1);
  const data = await db.update(spreadsheetId, sheetName, _row, req.body);
  res.json(data);
});

module.exports = router;
