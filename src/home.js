//Логіка сторінки Home
import { refs } from './js/refs.js';
import { initModalListeners } from './js/modal.js';
import {
  initSharedListeners,
  loadInitialCategories,
  loadProducts,
  onCategoryClick,
  onLoadMoreClick,
} from './js/handlers.js';
import { getTheme } from './js/storage.js';

async function initHomePage() {
  document.documentElement.dataset.theme = getTheme();

  initModalListeners();
  initSharedListeners();

  refs.categoriesList?.addEventListener('click', onCategoryClick);
  refs.loadMoreBtn?.addEventListener('click', onLoadMoreClick);

  await loadInitialCategories();
  await loadProducts({ page: 1, append: false });
}

initHomePage();
