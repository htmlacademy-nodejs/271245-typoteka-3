'use strict';

const express = require(`express`);
const path = require(`path`);
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);
const rootRoutes = require(`./routes/root`);

const PUBLIC_DIR = `public`;
const TEMPLATES_DIR = `templates`;

const port = 8080;

const {green} = require(`chalk`);

const app = express();

app.use(`/`, rootRoutes);

app.use(`/my`, myRoutes);

app.use(`/articles`, articlesRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.listen(port, () => {
  console.log(green(`Сервер создан, порт: ${port}`));
});

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);
