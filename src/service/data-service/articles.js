'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constans.js`);
const {createDate} = require(`../../utils.js`);

const THREE_MONTH_TIMESTAMP = 86400000 * 7 * 4 * 3;

class ArticlesService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = Object.assign({id: nanoid(MAX_ID_LENGTH), comments: [], createdDate: createDate(Date.now() - THREE_MONTH_TIMESTAMP, Date.now())}, article);
    this._articles.push(newArticle);
    return newArticle;
  }

  findAll() {
    return this._articles;
  }

  findOne(articleID) {
    return this._articles.find((item) => item.id === articleID);
  }

  update(articleID, article) {
    const oldArticle = this._articles.find((item) => item.id === articleID);

    return Object.assign(oldArticle, article);
  }

  drop(articleID) {
    const articleToDelete = this._articles.find((item) => item.id === articleID);

    if (!articleToDelete) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== articleID);

    return articleToDelete;
  }
}

module.exports = ArticlesService;
