'use strict';

class ArticlesService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    return this._offers;
  }
}

module.exports = ArticlesService;
