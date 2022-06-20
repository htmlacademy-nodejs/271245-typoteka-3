'use strict';

class CategoryService {
  constructor(article) {
    this._article = article;
  }

  findAll() {
    const categories = this._article.reduce((acc, item) => {
      item.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
