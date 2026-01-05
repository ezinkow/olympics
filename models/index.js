'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = (process.env.NODE_ENV || 'development').trim();
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

console.log('ENV:', process.env.NODE_ENV);
console.log('DIALECT:', config.dialect);

if (config.use_env_variable) {
  const dbUrl = process.env[config.use_env_variable];
  if (!dbUrl) {
    throw new Error(
      `Environment variable ${config.use_env_variable} is not set!`
    );
  }
  sequelize = new Sequelize(dbUrl, config);
} else {
  // fallback for local dev
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
