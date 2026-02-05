module.exports = function (sequelize, DataTypes) {
    const OlympicTeams = sequelize.define("OlympicTeams", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        country_name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: true,
        }
    });

    return OlympicTeams;
};
