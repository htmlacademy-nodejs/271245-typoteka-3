'use strict';

const Sequelize = require(`sequelize`);
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_MS} = process.env;
const MAX_POOL_QUANTITY = 5;
const POOL_CONNECTION_IDLE_MAXTIME = 10000;
const POOL_TRY_CONNECTION_MAXTIME = 10000;

const someMainDBSettingsNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT].some((it) => it === undefined);

if (someMainDBSettingsNotDefined) {
  throw new Error(`One or more DB environmental variables are not defined`);
}

module.exports = new Sequelize({
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_MS || `postgres`,
  pool: {
    max: MAX_POOL_QUANTITY,
    min: 0,
    acquire: POOL_TRY_CONNECTION_MAXTIME,
    idle: POOL_CONNECTION_IDLE_MAXTIME,
  }
});
