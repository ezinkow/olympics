// Import your sequelize instance from your models/index.js or wherever you define it
const { sequelize } = require("../models");

module.exports = function (app) {
    // Get standings based on submitted rosters and country scores
    app.get("/api/standings", async (req, res) => {
        try {
            const results = await sequelize.query(
                `
                SELECT
  r.name,
  SUM(c.score) AS total,
  GROUP_CONCAT(r.country_name ORDER BY c.score DESC SEPARATOR '<br>') AS country_list
FROM olympicrosters r
JOIN countrypools c
  ON c.country_name = r.country_name
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
