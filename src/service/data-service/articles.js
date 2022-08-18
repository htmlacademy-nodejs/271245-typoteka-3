'use strict';

const Aliase = require(`../models/aliase.js`);

class ArticlesService {
  constructor(sequelize) {
    this._Publication = sequelize.models.Publication;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(publicationData) {
    const publication = await this._Publication.create(publicationData);
    await publication.addCategories(publicationData.categories);
    return publication.get();
  }

  async findAll(needCommentsFlag) {
    const include = needCommentsFlag ? [Aliase.CATEGORIES] : [Aliase.CATEGORIES, Aliase.COMMENTS];

    const publications = await this._Publication.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return publications.map((item) => item.get());
  }

  findOne(publicationId) {
    return this._Publication.findByPk(publicationId, {
      include: [Aliase.CATEGORIES],
    });
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
