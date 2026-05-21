//Логіка сторінки Wishlist
import { STORAGE_KEYS } from './js/constants.js';
import { initModalListeners } from './js/modal.js';
import { getTheme } from './js/storage.js';
import { initSharedListeners, loadProductsByIds } from './js/handlers.js';

async function initWishlistPage() {
  document.documentElement.dataset.theme = getTheme();

  initModalListeners();
  initSharedListeners();

  await loadProductsByIds(STORAGE_KEYS.wishlist);
}

initWishlistPage();