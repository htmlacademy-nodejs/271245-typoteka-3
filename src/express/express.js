'use strict';

const express = require(`express`);
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);
const port = 8080;

const {green} = require(`chalk`);

const app = express();

app.get(`/`, (req, res) => {
  res.send(`/`);
});

app.get(`/register`, (req, res) => {
  res.send(`/register`);
});

app.get(`/login`, (req, res) => {
  res.send(`/login `);
});

app.get(`/search`, (req, res) => {
  res.send(`/search `);
});

app.get(`/search`, (req, res) => {
  res.send(`/search `);
});

app.use(`/my`, myRoutes);

app.use(`/articles`, articlesRoutes);

app.listen(port, () => {
  console.log(green(`Сервер создан, порт: ${port}`));
});
