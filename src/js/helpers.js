import { STORAGE_KEYS } from './constants.js';
import { load, save } from './storage.js';

export function showLoader() {
  const loader = document.querySelector('.loader');
  if (loader) loader.classList.add('loader--visible');
}

export function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) loader.classList.remove('loader--visible');
}

export function showNotFound() {
  const el = document.querySelector('.not-found');
  if (el) el.classList.add('not-found--visible');
}

export function hideNotFound() {
  const el = document.querySelector('.not-found');
  if (el) el.classList.remove('not-found--visible');
}

export function showLoadMoreButton() {
  const btn = document.querySelector('.load-more');
  if (btn) btn.hidden = false;
}

export function hideLoadMoreButton() {
  const btn = document.querySelector('.load-more');
  if (btn) btn.hidden = true;
}

export function smoothScrollUp() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function updateThemeOnHtml(theme) {
  document.documentElement.dataset.theme = theme;
}

export function initTheme() {
  const savedTheme = load(STORAGE_KEYS.THEME, 'light');
  updateThemeOnHtml(savedTheme);
}

export function toggleTheme() {
  const currentTheme = load(STORAGE_KEYS.THEME, 'light');
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  save(STORAGE_KEYS.THEME, nextTheme);
  updateThemeOnHtml(nextTheme);
}

export function calculateTotalPrice(products = []) {
  return products.reduce((total, product) => total + product.price, 0);
}

export function getIdsFromStorage(key) {
  return load(key, []);
}