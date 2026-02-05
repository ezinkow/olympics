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
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    });

    return OlympicTeams;
};
