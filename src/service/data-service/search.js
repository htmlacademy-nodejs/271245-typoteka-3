'use strict';

class SearchService {
  constructor(article) {
    this._article = article;
  }

  findAll(searchText) {
    const text = searchText.toLowerCase();
    const foundArticles = this._article.filter((item) => item.title.toLowerCase().includes(text));
    return foundArticles;
  }
}

module.exports = SearchService;
