const { sequelize } = require("../models");

module.exports = function (app) {
  // GET /api/standings
  app.get("/api/standings", async (req, res) => {
    try {
      const results = await sequelize.query(
        `
        SELECT
          r.name,
          SUM(m.score) AS total,
          GROUP_CONCAT(CONCAT(r.country_name, ' — ', m.score) ORDER BY m.score DESC SEPARATOR '<br>') AS country_list
        FROM olympicteams r
        JOIN medaltable m
          ON m.country_name = r.country_name
        GROUP BY r.name
        ORDER BY total DESC;
        `,
        { type: sequelize.QueryTypes.SELECT }
      );

      res.json(results);
    } catch (err) {
      console.error("Standings query failed:", err);
      res.status(500).json({ error: "Failed to load standings" });
    }
  });
};
