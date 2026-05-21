import { STORAGE_KEYS, TEXT, PRODUCTS_PER_PAGE } from './constants.js';
import { refs } from './refs.js';
import {
  getAllProducts,
  getCategories,
  getProductById,
  getProductsByCategory,
  searchProducts,
} from './products-api.js';
import {
  clearProductsList,
  renderCartSummary,
  renderCategories,
  renderCounters,
  renderModalProduct,
  renderProducts,
} from './render-functions.js';
import {
  getProductIdFromEvent,
  hideLoader,
  isAllCategory,
  isValidSearchQuery,
  notifyError,
  notifyInfo,
  notifySuccess,
  setActiveCategoryButton,
  showLoader,
} from './helpers.js';
import { openModal } from './modal.js';
import { getStoredIds, setTheme, toggleIdInStorage } from './storage.js';

export const state = {
  currentPage: 1,
  currentCategory: 'All',
  currentQuery: '',
  total: 0,
  mode: 'all',
};

const showNotFoundMessage = isVisible => {
  refs.notFound?.classList.toggle('not-found--visible', isVisible);
};

const toggleLoadMoreButton = isVisible => {
  refs.loadMoreBtn?.classList.toggle('is-hidden', !isVisible);
};

const getResponseProducts = response => response.products ?? response;

const getPaginatedProducts = products => {
  const start = (state.currentPage - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  return products.slice(start, end);
};

const updateHomeView = (products, total, append = false) => {
  if (!append) {
    clearProductsList();
  }

  showNotFoundMessage(products.length === 0);

  if (products.length > 0) {
    renderProducts(products, { append });
  }

  const renderedCount = refs.productsList?.children.length ?? 0;
  const hasMore = renderedCount < total;

  toggleLoadMoreButton(hasMore);

  if (!hasMore && renderedCount > 0 && state.currentPage > 1) {
    notifyInfo('No more products found');
  }
};

export const loadInitialCategories = async () => {
  try {
    showLoader();

    const categories = await getCategories();
    renderCategories(['All', ...categories]);

    const allBtn = refs.categoriesList?.querySelector('.categories__btn');
    if (allBtn) {
      allBtn.classList.add('categories__btn--active');
    }
  } catch (error) {
    notifyError('Failed to load categories');
    console.error(error);
  } finally {
    hideLoader();
  }
};

export const loadProducts = async ({ page = 1, append = false } = {}) => {
  try {
    showLoader();
    state.currentPage = page;

    let response;
    let total = 0;
    let products = [];

    if (state.mode === 'search' && state.currentQuery) {
      response = await searchProducts(state.currentQuery);
      products = getResponseProducts(response);
      total = products.length;
      products = getPaginatedProducts(products);
    } else if (state.mode === 'category' && !isAllCategory(state.currentCategory)) {
      response = await getProductsByCategory(state.currentCategory);
      products = getResponseProducts(response);
      total = products.length;
      products = getPaginatedProducts(products);
    } else {
      response = await getAllProducts(page);
      products = getResponseProducts(response);
      total = response.total ?? products.length;
    }

    state.total = total;
    updateHomeView(products, total, append);
  } catch (error) {
    notifyError('Failed to load products');
    console.error(error);
  } finally {
    hideLoader();
  }
};

export const onCategoryClick = async event => {
  const button = event.target.closest('.categories__btn');
  if (!button) return;

  state.currentPage = 1;
  state.currentQuery = '';
  state.currentCategory = button.textContent.trim();
  state.mode = isAllCategory(state.currentCategory) ? 'all' : 'category';

  setActiveCategoryButton(button);

  if (refs.searchInput) {
    refs.searchInput.value = '';
  }

  if (refs.clearSearchBtn) {
    refs.clearSearchBtn.classList.add('is-hidden');
  }

  await loadProducts({ page: 1, append: false });
};

export const onLoadMoreClick = async () => {
  const prevCount = refs.productsList?.children.length ?? 0;

  if (prevCount >= state.total) {
    toggleLoadMoreButton(false);
    notifyInfo('No more products found');
    return;
  }

  await loadProducts({ page: state.currentPage + 1, append: true });

  const firstNewCard = refs.productsList?.children[prevCount];

  firstNewCard?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

export const onProductClick = async event => {
  const productId = getProductIdFromEvent(event);
  if (!productId) return;

  try {
    showLoader();

    const product = await getProductById(productId);
    renderModalProduct(product);
    openModal();
  } catch (error) {
    notifyError('Failed to load product details');
    console.error(error);
  } finally {
    hideLoader();
  }
};

export const onSearchSubmit = async event => {
  event.preventDefault();

  const query = refs.searchInput?.value.trim() ?? '';

  if (!isValidSearchQuery(query)) {
    notifyInfo('Please enter a search query');
    return;
  }

  state.currentPage = 1;
  state.currentQuery = query;
  state.currentCategory = 'All';
  state.mode = 'search';

  if (refs.clearSearchBtn) {
    refs.clearSearchBtn.classList.remove('is-hidden');
  }

  const allBtn = refs.categoriesList?.querySelector('.categories__btn');
  if (allBtn) {
    setActiveCategoryButton(allBtn);
  }

  await loadProducts({ page: 1, append: false });
};

export const onClearSearchClick = async () => {
  state.currentPage = 1;
  state.currentQuery = '';
  state.currentCategory = 'All';
  state.mode = 'all';

  if (refs.searchInput) {
    refs.searchInput.value = '';
  }

  if (refs.clearSearchBtn) {
    refs.clearSearchBtn.classList.add('is-hidden');
  }

  const allBtn = refs.categoriesList?.querySelector('.categories__btn');
  if (allBtn) {
    setActiveCategoryButton(allBtn);
  }

  await loadProducts({ page: 1, append: false });
};

export const onSearchInput = event => {
  const hasValue = event.target.value.trim().length > 0;
  refs.clearSearchBtn?.classList.toggle('is-hidden', !hasValue);
};

export const onModalActionClick = event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const productContainer = refs.modalProduct?.querySelector('[data-id]');
  const productId = productContainer?.dataset.id;

  if (!productId) return;

  const action = button.dataset.action;
  const storageKey =
    action === 'cart' ? STORAGE_KEYS.cart : STORAGE_KEYS.wishlist;

  const { isAdded } = toggleIdInStorage(storageKey, Number(productId));

  if (action === 'cart') {
    button.textContent = isAdded ? TEXT.removeFromCart : TEXT.addToCart;
  }

  if (action === 'wishlist') {
    button.textContent = isAdded
      ? TEXT.removeFromWishlist
      : TEXT.addToWishlist;
  }

  renderCounters();
};

export const onBuyProductsClick = () => {
  notifySuccess('Products purchased successfully');
};

export const onThemeToggleClick = () => {
  const currentTheme = document.documentElement.dataset.theme || 'light';
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.documentElement.dataset.theme = nextTheme;
  setTheme(nextTheme);
};

export const onScrollUpClick = () => {
  refs.productsList?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

export const loadProductsByIds = async storageKey => {
  try {
    showLoader();

    const ids = getStoredIds(storageKey);

    if (!ids.length) {
      clearProductsList();
      showNotFoundMessage(true);
      toggleLoadMoreButton(false);

      if (storageKey === STORAGE_KEYS.cart) {
        renderCartSummary([]);
      }

      return;
    }

    const products = await Promise.all(ids.map(id => getProductById(id)));

    clearProductsList();
    renderProducts(products);
    showNotFoundMessage(false);
    toggleLoadMoreButton(false);

    if (storageKey === STORAGE_KEYS.cart) {
      renderCartSummary(products);
    }
  } catch (error) {
    notifyError('Failed to load saved products');
    console.error(error);
  } finally {
    hideLoader();
  }
};

export const initSharedListeners = () => {
  refs.productsList?.addEventListener('click', onProductClick);
  refs.searchForm?.addEventListener('submit', onSearchSubmit);
  refs.searchInput?.addEventListener('input', onSearchInput);
  refs.clearSearchBtn?.addEventListener('click', onClearSearchClick);
  refs.modalProduct?.addEventListener('click', onModalActionClick);
  refs.themeToggleBtn?.addEventListener('click', onThemeToggleClick);
  refs.scrollUpBtn?.addEventListener('click', onScrollUpClick);

  renderCounters();
};