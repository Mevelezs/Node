const { Sequelize } = require('sequelize');

const { config } = require('../config/config');
const setupModels = require('../db/models');


const USER = encodeURIComponent(config.dbUser) // cifra la data sensible.
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

const sequelize = new Sequelize(URI,{
  dialect: 'postgres',
  logging: console.log
});

setupModels(sequelize);

//sequelize.sync(); // se sincronisa con las schemas y crea las tablas de acuerdo a lo requerido.
//no recomnedado

module.exports = sequelize;
