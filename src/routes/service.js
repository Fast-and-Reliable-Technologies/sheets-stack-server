// @ts-check
const express = require("express");
const packageJson = require("../../package.json");

const router = express.Router();
const { name, version, description /*dependencies*/ } = packageJson;
const INFO = { name, version, description };

router.get("/ping", (req, res) => {
  res.json("pong");
});

router.get("/info", (req, res) => {
  res.json(INFO);
});

router.get("/meta", (req, res) => {
  res.json(INFO);
});

module.exports = router;
