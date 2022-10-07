'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constants.js`);
const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/v1`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limit, comments} = {}) {
    return this._load(`/articles`, {
      params: {offset, limit, comments},
    });
  }

  getArticle({publicationId, needCategoriesCount = false}) {
    return this._load(`/articles/${publicationId}`, {
      params: {needCategoriesCount},
    });
  }

  removeArticle({publicationId, userId}) {
    return this._load(`/articles/${publicationId}`, {
      method: HttpMethod.DELETE,
      data: {userId, publicationId}
    });
  }

  search(query) {
    return this._load(`/search`, {
      params: {query}
    });
  }

  async getCategory({categoryId, limit, offset} = {}) {
    return this._load(`/category/${categoryId}`, {
      params: {limit, offset}
    });
  }

  async createCategory(data) {
    return await this._load(`/category`, {
      method: HttpMethod.POST,
      data
    });
  }

  editCategory({categoryId, newCategory}) {
    return this._load(`/category/${categoryId}`, {
      method: HttpMethod.PUT,
      data: {categoryId, newCategory}
    });
  }

  async getCategories({categoryCount, currentPublication} = {}) {
    return await this._load(`/category`, {
      params: {categoryCount, currentPublication}
    });
  }

  removeCategory({categoryId, userId}) {
    return this._load(`/category/${categoryId}`, {
      method: HttpMethod.DELETE,
      data: {userId, categoryId}
    });
  }

  async createArticle(data) {
    return await this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle({articleId, data}) {
    return this._load(`/articles/${articleId}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment({articleId, data}) {
    return this._load(`/articles/${articleId}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  getLastComments({count} = {}) {
    return this._load(`/articles/comments`, {
      params: {count}
    });
  }

  removeComment({articleId, userId, commentId}) {
    return this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
      data: {
        userId
      }
    });
  }

  createUser({data}) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth({email, password}) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => {
    return defaultAPI;
  }
};
