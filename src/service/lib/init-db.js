'use strict';

const defineAllModel = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categoryList, publications}) => {
  const {Category, Publication} = defineAllModel(sequelize);
  await sequelize.sync({force: true});

  const categoryDBValues = categoryList.map((item) => ({title: item}));
  const categoryModels = await Category.bulkCreate(categoryDBValues);

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.title]: next.id,
    ...acc
  }), {});

  const publicationPromises = publications.map(async (publication) => {
    const publicationModel = await Publication.create(publication, {include: [Aliase.COMMENTS]});
    await publicationModel.addCategories(publication.category.map((title) => categoryIdByName[title]));
  });
  await Promise.all(publicationPromises);
};
