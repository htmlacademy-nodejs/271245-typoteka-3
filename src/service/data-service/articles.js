'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase.js`);

class ArticlesService {
  constructor(sequelize) {
    this._Publication = sequelize.models.Publication;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._PublicationCategory = sequelize.models.PublicationCategory;
    this._User = sequelize.models.User;
  }

  async create(publicationData) {
    const publication = await this._Publication.create(publicationData);
    await publication.addCategories(publicationData.categories);
    return publication.get();
  }

  async findAll(needCommentsFlag, quantity) {
    const include = needCommentsFlag ? [Aliase.CATEGORIES, {
      model: this._Comment,
      as: Aliase.COMMENTS,
      include: [
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
    }] : [Aliase.CATEGORIES];

    const publications = await this._Publication.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    if (quantity) {
      return publications.map((item) => item.get()).sort((a, b) => b.comments.length - a.comments.length).splice(0, +quantity);
    }

    return publications.map((item) => item.get());
  }

  async findOne({publicationId, needCategoriesCount}) {
    let categories;
    let data = await this._Publication.findByPk(publicationId, {
      include: [Aliase.CATEGORIES, {
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ],
      }],
      order: [
        [{model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`]
      ],
    });
    data = data ? data.toJSON() : data;

    if (needCategoriesCount) {
      categories = await this._Category.findAll({
        where: {
          id: data.categories.map((item) => item.id),
        },
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
      categories = categories.map((category) => category.get());
    }

    return {
      ...data,
      ...(needCategoriesCount && {categories}),
    };
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Publication.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });
    return {count, articles: rows};
  }

  async update(publicationId, publicationData) {
    const affectedRows = await this._Publication.update(publicationData, {
      where: {
        id: publicationId,
      }
    });

    const updatedArticle = await this._Publication.findOne({
      where: {
        id: publicationId,
      }
    });

    await updatedArticle.setCategories(publicationData.categories);

    return Boolean(affectedRows);
  }

  async drop(publicationId) {
    const deletedRows = await this._Publication.destroy({
      where: {
        id: publicationId,
      }
    });
    return Boolean(deletedRows);
  }
}

module.exports = ArticlesService;
