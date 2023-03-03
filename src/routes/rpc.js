// @ts-check
const _ = require("lodash");
const express = require("express");
const createError = require("http-errors");
const {
  sheets: { SpreadsheetsClient, getAuth, getSheetsClient },
} = require("@de44/sheets-stack-core");

const router = express.Router();

/** @typedef {import('@de44/sheets-stack-core').sheets.SpreadsheetsClient} SpreadsheetsClient */

/**
 * @returns {Promise<SpreadsheetsClient>}
 */
const cliP = new Promise(async (res, rej) => {
  const auth = getAuth();
  const sheetsClient = await getSheetsClient(auth);
  res(new SpreadsheetsClient(sheetsClient));
});

const toString = (val, defaultValue = undefined) => {
  if (_.isString(val)) return val;
  if (!_.isNil(val)) return val.toString();
  return defaultValue;
};

router.get("/meta", async (req, res, next) => {
  const spreadsheetId = toString(req.query.spreadsheetId);
  if (_.isNil(spreadsheetId))
    return next(createError(400, "Missing `spreadsheetId`"));
  /** @type {SpreadsheetsClient} */
  const cli = await cliP;
  const result = await cli.sheetDetails(spreadsheetId);
  res.json(result);
});

// router.get("/cells", async (req, res, next) => {
//   const spreadsheetId = toString(req.query.spreadsheetId);
//   const sheetName = toString(req.query.sheetName);
//   if (_.isNil(spreadsheetId))
//     return next(createError(400, "Missing `spreadsheetId`"));
//   if (_.isNil(sheetName)) return next(createError(400, "Missing `sheetName`"));
//   const cli = await cliP;
//   cli.
// });

module.exports = router;
