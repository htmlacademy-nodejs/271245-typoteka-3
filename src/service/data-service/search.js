'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase.js`);

class SearchService {
  constructor(sequelize) {
    this._Publication = sequelize.models.Publication;
  }

  async findAll(searchText) {
    const publications = await this._Publication.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Aliase.CATEGORIES],
      order: [
        [`createdAt`, `DESC`]
      ]
    });
    return publications.map((publication) => publication.get());
  }
}

module.exports = SearchService;
