import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './constants.js';

axios.defaults.baseURL = API_BASE_URL;

export async function getCategories() {
  const { data } = await axios.get(API_ENDPOINTS.CATEGORIES);
  return data;
}

export async function getAllProducts(pageNumber = 1) {
  const limit = 12;
  const skip = (pageNumber - 1) * limit;

  const { data } = await axios.get(
    `${API_ENDPOINTS.PRODUCTS}?limit=${limit}&skip=${skip}`
  );

  return data;
}

export async function getProductsByCategory(category) {
  const { data } = await axios.get(
    `${API_ENDPOINTS.PRODUCTS_BY_CATEGORY}${encodeURIComponent(category)}`
  );

  return data;
}

export async function getProductById(productId) {
  const { data } = await axios.get(
    `${API_ENDPOINTS.PRODUCTS}/${productId}`
  );

  return data;
}

export async function searchProducts(query) {
  const { data } = await axios.get(
    `${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`
  );

  return data;
}