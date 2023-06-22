const { config } = require('../config/config'); // crea una db 


const USER = encodeURIComponent(config.dbUser) // cifra la data sensible.
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

module.exports = {
  development:{
    url : URI,
    dialect:'postgres'
  },
  production:{
    url:URI,
    dialect:'postgres'
  }
}
