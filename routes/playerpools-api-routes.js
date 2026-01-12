// Requiring our models
const { PlayerPools } = require("../models");

module.exports = function (app) {

  // Get all PlayerPools (clean + aligned with frontend)
  app.get("/api/playerpools", async function (req, res) {
    try {
      const playerPools = await PlayerPools.findAll();

      const formatted = playerPools.map((player) => {
        const parseScore = (val) => {
          const num = parseFloat(val);
          return Number.isFinite(num) ? num : 0;
        };

        const wild = parseScore(player.wild_card_score);
        const div = parseScore(player.divisional_score);
        const conf = parseScore(player.conf_championship_score);
        const sb = parseScore(player.super_bowl_score);

        const total_points = wild + div + conf + sb;

        return {
          id: player.id,
          player_name: player.player_name,
          team: player.team,
          position: player.position,
          tier: player.tier,
          eliminated: player.eliminated,
          times_selected: player.times_selected, // ✅ hardcoded column
          wild_card_score: wild,
          divisional_score: div,
          conf_championship_score: conf,
          super_bowl_score: sb,
          total_points,
        };
      });

      // 🔥 sort by total points descending
      formatted.sort((a, b) => b.total_points - a.total_points);

      res.json(formatted);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch player pools" });
    }
  });

};
