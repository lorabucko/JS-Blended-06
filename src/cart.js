//Логіка сторінки Cart
import iziToast from 'izitoast';
import { refs } from './refs.js';
import { STORAGE_KEYS } from './constants.js';
import { load, save } from './storage.js';
import { getProductById } from './products-api.js';
import {
  createProductsMarkup,
  renderProducts,
  renderCartSummary,
} from './render-functions.js';
import {
  onProductClick,
  onModalActionClick,
  updateNavCounters,
} from './handlers.js';
import { initModal } from './modal.js';
import {
  initTheme,
  toggleTheme,
  showLoader,
  hideLoader,
  showNotFound,
} from './helpers.js';

async function loadCartPage() {
  try {
    showLoader();
    updateNavCounters();

    const ids = load(STORAGE_KEYS.CART, []);

    if (!ids.length) {
      renderProducts(refs.productsList, '');
      renderCartSummary(refs.cartItemsCount, refs.cartTotalPrice, []);
      showNotFound();
      return;
    }

    const products = await Promise.all(ids.map(id => getProductById(id)));

    renderProducts(refs.productsList, createProductsMarkup(products));
    renderCartSummary(refs.cartItemsCount, refs.cartTotalPrice, products);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load cart',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function onBuyProducts() {
  const ids = load(STORAGE_KEYS.CART, []);

  if (!ids.length) {
    iziToast.warning({
      title: 'Warning',
      message: 'Cart is empty',
      position: 'topRight',
    });
    return;
  }

  save(STORAGE_KEYS.CART, []);
  updateNavCounters();
  renderProducts(refs.productsList, '');
  renderCartSummary(refs.cartItemsCount, refs.cartTotalPrice, []);

  iziToast.success({
    title: 'Success',
    message: 'Products purchased successfully',
    position: 'topRight',
  });
}

function initCartPage() {
  initTheme();
  initModal();
  loadCartPage();

  refs.productsList?.addEventListener('click', onProductClick);
  refs.modalContent?.addEventListener('click', onModalActionClick);
  refs.buyBtn?.addEventListener('click', onBuyProducts);
  refs.themeBtn?.addEventListener('click', toggleTheme);
}

initCartPage();