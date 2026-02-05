module.exports = function (sequelize, DataTypes) {
    const MedalTables = sequelize.define(
        "MedalTables",
        {
            country_name: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            gold: DataTypes.INTEGER,
            silver: DataTypes.INTEGER,
            bronze: DataTypes.INTEGER,
            score: DataTypes.INTEGER,
        }
    );

    return MedalTables;
};
