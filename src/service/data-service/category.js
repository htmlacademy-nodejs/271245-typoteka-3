'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase.js`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._PublicationCategory = sequelize.models.PublicationCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `title`,
          [Sequelize.fn(`COUNT`, `id`), `count`]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._PublicationCategory,
          as: Aliase.PUBLICATION_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }
}

module.exports = CategoryService;
