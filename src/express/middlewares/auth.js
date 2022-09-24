'use strict';

const auth = (req, res, next) => {
  const {user} = req.session;

  if (!user) {
    return res.redirect(`/login`);
  }
  return next();
};

module.exports = auth;
