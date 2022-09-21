'use strict';

const {hash, hashSync} = require(`bcrypt`);

const SALT_ROUNDS = 10;

const passwordUtils = {
  hash(password) {
    return hash(password, SALT_ROUNDS);
  },
  hashSync(password) {
    return hashSync(password, SALT_ROUNDS);
  },
};

module.exports = passwordUtils;
