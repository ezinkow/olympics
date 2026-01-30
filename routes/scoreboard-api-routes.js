const express = require("express");
const { OlympicRosters, MedalTable } = require("../models");

const router = express.Router();

router.get("/api/scoreboard", async (req, res) => {
  try {
    // 1️⃣ Get all roster picks
    const rosters = await OlympicRosters.findAll({ raw: true });

    // 2️⃣ Get medal scores
    const medals = await MedalTable.findAll({ raw: true });
    const medalMap = {};
    medals.forEach((m) => {
      medalMap[m.country_name] = m.score || 0;
    });

    // 3️⃣ Group by user and calculate points
    const usersMap = {};

    rosters.forEach((r) => {
      if (!usersMap[r.name]) {
        usersMap[r.name] = { name: r.name, countries: [], total: 0 };
      }

      const points = medalMap[r.country_name] || 0;

      usersMap[r.name].countries.push({
        country_name: r.country_name,
        points,
      });

      usersMap[r.name].total += points;
    });

    // 4️⃣ Convert to array and sort by total descending
    const users = Object.values(usersMap).sort((a, b) => b.total - a.total);

    res.json(users);
  } catch (err) {
    console.error("Failed to fetch scoreboard:", err);
    res.status(500).json({ error: "Failed to fetch scoreboard" });
  }
});

module.exports = router;
