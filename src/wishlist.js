//Логіка сторінки Wishlist
import iziToast from 'izitoast';
import { refs } from './refs.js';
import { STORAGE_KEYS } from './constants.js';
import { load } from './storage.js';
import { getProductById } from './products-api.js';
import { createProductsMarkup, renderProducts } from './render-functions.js';
import {
  onProductClick,
  onModalActionClick,
  updateNavCounters,
} from './handlers.js';
import { initModal } from './modal.js';
import { initTheme, toggleTheme, showLoader, hideLoader, showNotFound } from './helpers.js';

async function loadWishlistPage() {
  try {
    showLoader();
    updateNavCounters();

    const ids = load(STORAGE_KEYS.WISHLIST, []);

    if (!ids.length) {
      renderProducts(refs.productsList, '');
      showNotFound();
      return;
    }

    const products = await Promise.all(ids.map(id => getProductById(id)));
    renderProducts(refs.productsList, createProductsMarkup(products));
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load wishlist',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function initWishlistPage() {
  initTheme();
  initModal();
  loadWishlistPage();

  refs.productsList?.addEventListener('click', onProductClick);
  refs.modalContent?.addEventListener('click', onModalActionClick);
  refs.themeBtn?.addEventListener('click', toggleTheme);
}

initWishlistPage();