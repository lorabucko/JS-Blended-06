//Логіка сторінки Cart
import { STORAGE_KEYS } from './js/constants.js';
import { refs } from './js/refs.js';
import { initModalListeners } from './js/modal.js';
import { getTheme } from './js/storage.js';
import {
  initSharedListeners,
  loadProductsByIds,
  onBuyProductsClick,
} from './js/handlers.js';

async function initCartPage() {
  document.documentElement.dataset.theme = getTheme();

  initModalListeners();
  initSharedListeners();

  refs.buyProductsBtn?.addEventListener('click', onBuyProductsClick);

  await loadProductsByIds(STORAGE_KEYS.cart);
}

initCartPage();