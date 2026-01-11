module.exports = function (sequelize, DataTypes) {
    const PlayerStats = sequelize.define("PlayerStats", {

        espn_id: { type: DataTypes.STRING, allowNull: false, unique: true },
        name: { type: DataTypes.STRING, allowNull: false },
        team: DataTypes.STRING,
        position: DataTypes.STRING,
        fantasy_points: DataTypes.FLOAT,
        round: DataTypes.INTEGER,
    });

    return PlayerStats;
};
