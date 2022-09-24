'use strict';

const {hash, hashSync, compare} = require(`bcrypt`);

const SALT_ROUNDS = 10;

const passwordUtils = {
  hash(password) {
    return hash(password, SALT_ROUNDS);
  },
  hashSync(password) {
    return hashSync(password, SALT_ROUNDS);
  },
  compare,
};

module.exports = passwordUtils;
