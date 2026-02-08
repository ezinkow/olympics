// Dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");

// Initialize app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// Static React build (production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Routes (pass app to each module)
require("./routes/countrypools-api-routes")(app);
require("./routes/names-api-routes")(app);
require("./routes/olympicteams-api-routes")(app);
require("./routes/standings-api-routes")(app);
require("./routes/scoreboard-api-routes")(app);
require("./routes/news-api-routes")(app);
require("./routes/medaltable-api-routes")(app);

// React Router fallback
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start server after syncing
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });
});
