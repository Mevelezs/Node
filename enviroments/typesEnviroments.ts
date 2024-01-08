/**
 * Este archivo es para tipar las variables de ambientes y a demás permite agruparlas
 */

import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    databases: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    },
    postgres: {
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      dbName: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      host: process.env.POSTGRES_HOST,
    },
    mysql: {
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      dbName: process.env.MYSQL_DATABASE,
      port: parseInt(process.env.MYSQL_PORT, 10),
      host: process.env.MYSQL_HOST,
    },

    apiKey: process.env.API_KEY,
    jtwKey: process.env.JWT_SECRET,
  };
});
