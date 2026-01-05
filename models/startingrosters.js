module.exports = function (sequelize, DataTypes) {
    const StartingRosters = sequelize.define("StartingRosters", {
        name: {
            type: DataTypes.STRING, // use STRING instead of TEXT to allow indexing
            allowNull: false
        },
        round: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        player_name: {
            type: DataTypes.STRING, // use STRING to allow indexing
            allowNull: false
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false
        },
        team: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slot: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ["name", "round", "player_name"]
            }
        ]
    });

    return StartingRosters;
};
