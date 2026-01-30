module.exports = function (sequelize, DataTypes) {
    const CountryPools = sequelize.define("CountryPools", {
        country_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        gold: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        silver: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        bronze: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
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
