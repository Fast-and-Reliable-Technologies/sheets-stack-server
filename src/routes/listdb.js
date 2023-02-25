// @ts-check
const _ = require("lodash");
const express = require("express");
const createError = require("http-errors");
const {
  logging: { logger },
  sheets: { getAuth, getSheetsClient, SpreadsheetsClient },
  ListsDatabase,
} = require("@de44/sheets-stack-core");

const router = express.Router();

const toString = (val, defaultValue = undefined) => {
  if (_.isString(val)) return val;
  if (!_.isNil(val)) return val.toString();
  return defaultValue;
};

async function getDb() {
  const auth = getAuth();
  const sheetsCli = await getSheetsClient(auth);
  const cli = new SpreadsheetsClient(sheetsCli, logger);
  return new ListsDatabase(cli);
}

const dbP = getDb();

router.get("/titles", async (req, res, next) => {
  const spreadsheetId = toString(req.query.spreadsheetId);
  const sheetName = toString(req.query.sheetName);
  if (_.isNil(spreadsheetId))
    return next(createError(400, "Missing `spreadsheetId`"));
  if (_.isNil(sheetName)) return next(createError(400, "Missing `sheetName`"));
  const db = await dbP;
  const titles = await db.getTitles(spreadsheetId, sheetName);
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

router.get("/read", async (req, res, next) => {
  const spreadsheetId = toString(req.query.spreadsheetId);
  const sheetName = toString(req.query.sheetName);
  if (_.isNil(spreadsheetId))
    return next(createError(400, "Missing `spreadsheetId`"));
  if (_.isNil(sheetName)) return next(createError(400, "Missing `sheetName`"));
  const db = await dbP;
  const data = await db.list(spreadsheetId, sheetName);
  res.json(data);
});

module.exports = router;
