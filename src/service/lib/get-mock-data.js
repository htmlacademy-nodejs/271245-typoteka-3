'use strict';

const fs = require(`fs`).promises;
const FILENAME = `mock.json`;
let data = [];

const getMockData = async () => {
  if (data.length) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILENAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.log(err);
    return (err);
  }

  return data;
};

module.exports = getMockData;
