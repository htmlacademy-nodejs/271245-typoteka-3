'use strict';

const express = require(`express`);
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);
const rootRoutes = require(`./routes/root`);
const port = 8080;

const {green} = require(`chalk`);

const app = express();

app.use(`/`, rootRoutes);

app.use(`/my`, myRoutes);

app.use(`/articles`, articlesRoutes);

app.listen(port, () => {
  console.log(green(`Сервер создан, порт: ${port}`));
});
