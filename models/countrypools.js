module.exports = function (sequelize, DataTypes) {
    const CountryPools = sequelize.define("CountryPools", {
        country_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        gold: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        silver: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        bronze: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        times_selected: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        gold_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        silver_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        bronze_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    });

    return CountryPools;
};
