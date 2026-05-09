import { BASE_URL, PRODUCTS_LIMIT } from './constants.js';

async function fetchData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export function getCategories() {
  return fetchData(`${BASE_URL}/products/category-list`);
}

export function getProducts(page = 1, limit = PRODUCTS_LIMIT) {
  const skip = (page - 1) * limit;
  return fetchData(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
}

export function getProductById(id) {
  return fetchData(`${BASE_URL}/products/${id}`);
}

export function searchProducts(query, page = 1, limit = PRODUCTS_LIMIT) {
  const skip = (page - 1) * limit;
  return fetchData(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
  );
}

export function getProductsByCategory(category, page = 1, limit = PRODUCTS_LIMIT) {
  const skip = (page - 1) * limit;
  return fetchData(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  );
}