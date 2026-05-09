//Логіка сторінки Home
import { refs } from './refs.js';
import { initModal } from './modal.js';
import {
  loadInitialCategories,
  loadInitialProducts,
  onCategoryClick,
  onProductClick,
  onLoadMoreClick,
  onModalActionClick,
  onSearchSubmit,
  onClearSearchClick,
  onSearchInput,
  onScrollUpClick,
  updateNavCounters,
} from './handlers.js';
import { initTheme, toggleTheme } from './helpers.js';

async function initHomePage() {
  initTheme();
  initModal();
  updateNavCounters();

  await loadInitialCategories();
  await loadInitialProducts();

  refs.categoriesList?.addEventListener('click', onCategoryClick);
  refs.productsList?.addEventListener('click', onProductClick);
  refs.loadMoreBtn?.addEventListener('click', onLoadMoreClick);
  refs.modalContent?.addEventListener('click', onModalActionClick);
  refs.searchForm?.addEventListener('submit', onSearchSubmit);
  refs.clearSearchBtn?.addEventListener('click', onClearSearchClick);
  refs.searchInput?.addEventListener('input', onSearchInput);
  refs.scrollUpBtn?.addEventListener('click', onScrollUpClick);
  refs.themeBtn?.addEventListener('click', toggleTheme);
}

initHomePage();
