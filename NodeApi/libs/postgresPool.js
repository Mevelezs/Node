const { Pool } = require('pg'); // de esta forma se hace y await interno y se hace la coneccion tambien con otras dependecias que la necesiten

/*
 const pool = new Pool(
   {
     host:'localhost',
     port:5432,
     user:'mauricio',
     password:'admin123',
     database:'my_store'
    }
    );
*/

// Lo de arriba funciona pero es mejor mandar las variables de entorno protegidas

const { config } = require('../config/config');

const USER = encodeURIComponent(config.dbUser) // cifra la data sensible.
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

const pool = new Pool({ connectionString: URI });

module.exports = pool;
