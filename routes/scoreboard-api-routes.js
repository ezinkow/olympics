const express = require("express");
const { OlympicTeams, MedalTables } = require("../models");

module.exports = function (app) {

  app.get("/api/scoreboard", async (req, res) => {
    try {
      // 1️⃣ Get all roster picks
      const teams = await OlympicTeams.findAll({ raw: true });

      // 2️⃣ Get medal scores
      const medals = await MedalTables.findAll({ raw: true });
      const medalMap = {};
      medals.forEach((m) => {
        medalMap[m.country_name] = m.score || 0;
      });

      // 3️⃣ Group by user and calculate points
      const usersMap = {};

      teams.forEach((r) => {
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

}
