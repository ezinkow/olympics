const express = require("express");
const { CountryStats } = require("../models");

const router = express.Router();

router.get("/", async (req, res) => {
  const players = await CountryStats.findAll();
  res.json(players);
});

module.exports = router;
