'use strict';

// const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase.js`);

class ArticlesService {
  constructor(sequelize) {
    this._Publication = sequelize.models.Publication;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._PublicationCategory = sequelize.models.PublicationCategory;
  }

  async create(publicationData) {
    const publication = await this._Publication.create(publicationData);
    await publication.addCategories(publicationData.categories);
    return publication.get();
  }

  async findAll(needCommentsFlag) {
    const include = needCommentsFlag ? [Aliase.CATEGORIES, Aliase.COMMENTS] : [Aliase.CATEGORIES];

    const publications = await this._Publication.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return publications.map((item) => item.get());
  }

  async findOne(publicationId) {
    return this._Publication.findByPk(publicationId, {
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
    });

    // return this._Publication.findByPk(publicationId, {
    //   include: [{
    //     attributes: [
    //       `id`,
    //       `title`,
    //       [Sequelize.fn(`COUNT`, `id`), `count`]
    //     ],
    //     group: [Sequelize.col(`Category.id`)],
    //     include: [{
    //       model: this._PublicationCategory,
    //       as: Aliase.PUBLICATION_CATEGORIES,
    //       attributes: []
    //     }]
    //   }, Aliase.COMMENTS],
    // });

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // const article = await this._Publication.findByPk(publicationId);
    // const comments = await article.getComments();
    // const categories = await article.getCategories();

    // const mappedCategories = await Promise.all(categories.map(async (item) => {
    //   let count = await item.getPublicationCategories({
    //     raw: true,
    //     attributes: [
    //       `categoryId`,
    //       [Sequelize.fn(`COUNT`, `publicationId`), `count`]
    //     ],
    //     group: [Sequelize.col(`categoryId`)],
    //   });

    //   return {
    //     ...item.get(),
    //     count: count[0].count,
    //   };
    // }));

    // return {
    //   ...article.get(),
    //   comments: comments.map((comment) => comment.get()),
    //   categories: mappedCategories,
    // };
  }

  async update(publicationId, publicationData) {
    const [modified] = await this._Publication.update(publicationData, {
      where: {
        id: publicationId,
      }
    });
    return Boolean(modified);
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
