'use strict';

const help = require(`./help.js`);
const filldb = require(`./filldb.js`);
const fill = require(`./fill.js`);
const version = require(`./version.js`);
const server = require(`./server.js`);

const Cli = {
  [fill.name]: fill,
  [filldb.name]: filldb,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
};

module.exports = {
  Cli,
};
