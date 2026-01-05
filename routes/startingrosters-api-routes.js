const { StartingRosters, PlayerPools } = require("../models");

let cachedData = null;
let lastFetch = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

module.exports = function (app) {
  app.get("/api/startingrosters", async (req, res) => {
    try {
      if (cachedData && Date.now() - lastFetch < CACHE_TTL) {
        return res.json(cachedData);
      }

      const rosters = await StartingRosters.findAll({
        order: [["name", "ASC"], ["round", "ASC"], ["slot", "ASC"]],
        raw: true,
      });

      const playerNames = [
        ...new Set(rosters.map((r) => r.player_name)),
      ];

      const pools = await PlayerPools.findAll({
        where: { player_name: playerNames },
        raw: true,
      });

      const poolMap = {};
      pools.forEach((p) => {
        poolMap[p.player_name] = p;
      });

      const merged = rosters.map((r) => {
        const pool = poolMap[r.player_name] || {};
        return {
          ...r,
          wild_card_score: Number(pool.wild_card_score || 0),
          divisional_score: Number(pool.divisional_score || 0),
          conf_championship_score: Number(
            pool.conf_championship_score || 0
          ),
          super_bowl_score: Number(pool.super_bowl_score || 0),
          eliminated: pool.eliminated || null,
        };
      });

      cachedData = merged;
      lastFetch = Date.now();

      res.json(merged);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to load scoreboard" });
    }
  });

  app.post("/api/startingrosters", async (req, res) => {
    try {
      const rows = req.body;

      if (!Array.isArray(rows) || !rows.length) {
        return res.status(400).json({ error: "Invalid roster payload" });
      }

      // Optional: clear existing roster for this user + round
      const { name, round } = rows[0];

      await StartingRosters.destroy({
        where: { name, round },
      });

      // Insert new roster
      await StartingRosters.bulkCreate(rows);

      // Clear cache so scoreboard updates
      cachedData = null;
      lastFetch = 0;

      res.json({ success: true });
    } catch (err) {
      console.error("Starting roster submit failed:", err);
      res.status(500).json({ error: "Failed to submit roster" });
    }
  });
};
