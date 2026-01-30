module.exports = function (sequelize, DataTypes) {
    const OlympicRosters = sequelize.define("OlympicRosters", {
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

    return OlympicRosters;
};
