'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase.js`);

class CategoryService {
  constructor(sequelize) {
    this._Publication = sequelize.models.Publication;
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

  async findOne(categoryId) {
    return this._Category.findByPk(categoryId);
  }

  async findPage(categoryId, limit, offset) {
    const articlesByCategory = await this._PublicationCategory.findAll({
      attributes: [`publicationId`],
      where: {
        categoryId,
      },
      raw: true
    });

    const publicationsId = articlesByCategory.map((publicationIdItem) => publicationIdItem.publicationId);

    const {count, rows} = await this._Publication.findAndCountAll({
      limit,
      offset,
      include: [
        Aliase.CATEGORIES,
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        id: publicationsId
      },
      distinct: true
    });

    return {count, articlesByCategory: rows};
  }

  async findByCategoryName(categoryName) {
    const category = await this._Category.findOne({
      where: {title: categoryName}
    });
    return category && category.get();
  }

  async create(newCategory) {
    const category = await this._Category.create(newCategory);
    return category.get();
  }
}

module.exports = CategoryService;
