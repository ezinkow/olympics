module.exports = function (sequelize, DataTypes) {
    const PlayerStats = sequelize.define("PlayerStats", {

        name: { type: DataTypes.STRING, allowNull: false },
        team: DataTypes.STRING,
        position: DataTypes.STRING,
        fantasy_points: DataTypes.FLOAT,
        round: DataTypes.INTEGER,
    });

    return PlayerStats;
};
