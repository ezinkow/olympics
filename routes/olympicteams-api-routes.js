const { OlympicTeams } = require("../models");

module.exports = function (app) {

    // ----------------------------------
    // GET all teams (admin/debug)
    // ----------------------------------
    app.get("/api/olympicteams", async (req, res) => {
        try {
            const rows = await OlympicTeams.findAll();
            res.json(rows);
        } catch (err) {
            res.status(500).json(err);
        }
    });

    // ----------------------------------
    // GET team by name (used for overwrite warning)
    // ----------------------------------
    app.get("/api/olympicteams/by-name/:name", async (req, res) => {
        try {
            const rows = await OlympicTeams.findAll({
                where: { name: req.params.name },
                order: [["id", "ASC"]],
            });
            res.json(rows);
        } catch (err) {
            res.status(500).json(err);
        }
    });

    app.get("/api/olympicteams/getmyteam", async (req, res) => {
        try {
            const { name } = req.query;
            if (!name) return res.status(400).json({ error: "Missing name parameter" });

            const rows = await OlympicTeams.findAll({
                where: { name },
                order: [["id", "ASC"]],
            });

            // just return the data as an array
            res.json(Array.isArray(rows) ? rows : []);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch user's team" });
        }
    });


    // ----------------------------------
    // POST team (OVERWRITE SAFE)
    // ----------------------------------
    app.post("/api/olympicteams", async (req, res) => {
        try {
            const data = Array.isArray(req.body) ? req.body : [req.body];
            const name = data[0]?.name;

            if (!name) {
                return res.status(400).json({ error: "Missing name" });
            }

            // 🔥 delete existing team first
            await OlympicTeams.destroy({ where: { name } });

            // insert new team
            const created = await OlympicTeams.bulkCreate(
                data.map(row => ({
                    name: row.name,
                    country_name: row.country_name,
                    price: row.price,
                }))
            );

            res.json({ success: true, overwritten: true, created });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    });
};