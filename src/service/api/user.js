'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants.js`);

const userValidator = require(`../middlewares/user-validator.js`);

const passwordUtils = require(`../lib/password.js`);

const userRoute = new Router();

const setUserController = (app, userService) => {
  app.use(`/user`, userRoute);

  userRoute.post(`/`, userValidator(userService), async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);

    const result = await userService.create(data);

    delete result.passwordHash;

    res.status(HttpCode.CREATED)
      .json(result);
  });

};

module.exports = setUserController;
