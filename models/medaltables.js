module.exports = function (sequelize, DataTypes) {
    const CountryStats = sequelize.define("CountryStats", {

        name: { type: DataTypes.STRING, allowNull: false },
        team: DataTypes.STRING,
        position: DataTypes.STRING,
        fantasy_points: DataTypes.FLOAT,
        round: DataTypes.INTEGER,
    });

    return CountryStats;
};
