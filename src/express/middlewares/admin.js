'use strict';

const {HttpCode} = require(`../../constants.js`);

const admin = (req, res, next) => {
  const {user} = req.session;

  if (!user.admin) {
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`, {user});
  }
  return next();
};

module.exports = admin;
