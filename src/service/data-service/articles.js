'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constans.js`);

class ArticlesService {
  constructor(article) {
    this._article = article;
  }

  create(article) {
    const newArticle = Object.assign({id: nanoid(MAX_ID_LENGTH), comments: []}, article);
    this._article.push(newArticle);
    return newArticle;
  }

  findAll() {
    return this._article;
  }

  findOne(articleID) {
    return this._article.find((item) => item.id === articleID);
  }

  update(articleID, article) {
    const oldArticle = this._article.find((item) => item.id === articleID);

    return Object.assign(oldArticle, article);
  }

  drop(articleID) {
    const articleToDelete = this._article.find((item) => item.id === articleID);

    if (!articleToDelete) {
      return null;
    }

    this._article = this._article.filter((item) => item.id !== articleID);

    return articleToDelete;
  }
}

module.exports = ArticlesService;
