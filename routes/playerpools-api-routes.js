// Requiring our models
const { PlayerPools } = require("../models");

module.exports = function (app) {

  // Get all PlayerPools (clean + aligned with frontend)
  app.get("/api/playerpools", async function (req, res) {
    try {
      const playerPools = await PlayerPools.findAll();

      const formatted = playerPools.map((player) => {
        console.log('plyyyyyyyyyyyyyyyyyyyyyer', player)
        const parseScore = (val) => {
          const num = parseFloat(val);
          return isNaN(num) ? 0 : num;
        };

        return {
          id: player.id,
          player_name: player.player_name,
          team: player.team,
          position: player.position,
          tier: player.tier,
          times_selected: player.times_selected,
          wild_card_score: parseScore(player.wild_card_score),
          divisional_score: parseScore(player.divisional_score),
          conf_championship_score: parseScore(player.conf_championship_score),
          super_bowl_score: parseScore(player.super_bowl_score),
        };
      });

      res.json(formatted);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch player pools" });
    }
  });

};
