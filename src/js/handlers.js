import iziToast from 'izitoast';
import {
  getCategories,
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
} from './products-api.js';
import {
  createCategoryMarkup,
  createProductsMarkup,
  createModalProductMarkup,
  renderCategories,
  renderProducts,
  appendProducts,
  renderModalContent,
  renderCounter,
} from './render-functions.js';
import { refs } from './refs.js';
import { CATEGORY_ALL, PRODUCTS_LIMIT, STORAGE_KEYS } from './constants.js';
import {
  addIdToStorage,
  hasIdInStorage,
  removeIdFromStorage,
  toggleIdInStorage,
  load,
} from './storage.js';
import {
  showLoader,
  hideLoader,
  showNotFound,
  hideNotFound,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './helpers.js';
import { openModal, closeModal } from './modal.js';

export const state = {
  currentPage: 1,
  currentCategory: CATEGORY_ALL,
  currentQuery: '',
  total: 0,
  mode: 'all',
  products: [],
  modalProductId: null,
};

export function updateNavCounters() {
  const wishlist = load(STORAGE_KEYS.WISHLIST, []);
  const cart = load(STORAGE_KEYS.CART, []);

  renderCounter(refs.wishlistCount, wishlist.length);
  renderCounter(refs.cartCount, cart.length);
}

function checkLoadMoreVisibility() {
  const loadedItems = state.currentPage * PRODUCTS_LIMIT;

  if (loadedItems >= state.total) {
    hideLoadMoreButton();
    iziToast.info({
      title: 'Info',
      message: 'Products ended',
      position: 'topRight',
    });
  } else {
    showLoadMoreButton();
  }
}

export async function loadInitialCategories() {
  try {
    showLoader();
    const categories = await getCategories();
    const allCategories = [CATEGORY_ALL, ...categories];
    renderCategories(
      refs.categoriesList,
      createCategoryMarkup(allCategories, CATEGORY_ALL)
    );
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load categories',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

export async function loadInitialProducts() {
  try {
    showLoader();
    hideNotFound();

    state.currentPage = 1;
    state.currentCategory = CATEGORY_ALL;
    state.currentQuery = '';
    state.mode = 'all';

    const data = await getProducts(state.currentPage);
    state.total = data.total;
    state.products = data.products;

    renderProducts(refs.productsList, createProductsMarkup(data.products));
    checkLoadMoreVisibility();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load products',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

export async function onLoadMoreClick() {
  try {
    showLoader();
    state.currentPage += 1;

    let data;

    if (state.mode === 'category') {
      data = await getProductsByCategory(state.currentCategory, state.currentPage);
    } else if (state.mode === 'search') {
      data = await searchProducts(state.currentQuery, state.currentPage);
    } else {
      data = await getProducts(state.currentPage);
    }

    appendProducts(refs.productsList, createProductsMarkup(data.products));
    checkLoadMoreVisibility();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more products',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

export async function onCategoryClick(event) {
  const btn = event.target.closest('.categories__btn');
  if (!btn) return;

  const category = btn.textContent.trim();

  document
    .querySelectorAll('.categories__btn')
    .forEach(item => item.classList.remove('categories__btn--active'));
  btn.classList.add('categories__btn--active');

  try {
    showLoader();
    hideNotFound();

    state.currentPage = 1;
    state.currentQuery = '';

    let data;

    if (category === CATEGORY_ALL) {
      state.currentCategory = CATEGORY_ALL;
      state.mode = 'all';
      data = await getProducts(state.currentPage);
    } else {
      state.currentCategory = category;
      state.mode = 'category';
      data = await getProductsByCategory(category, state.currentPage);
    }

    state.total = data.total || data.products.length;

    if (!data.products.length) {
      refs.productsList.innerHTML = '';
      showNotFound();
      hideLoadMoreButton();
      return;
    }

    renderProducts(refs.productsList, createProductsMarkup(data.products));
    checkLoadMoreVisibility();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load category products',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

export async function onProductClick(event) {
  const productCard = event.target.closest('.products__item');
  if (!productCard) return;

  const productId = Number(productCard.dataset.id);

  try {
    showLoader();

    const product = await getProductById(productId);
    state.modalProductId = productId;

    const isInWishlist = hasIdInStorage(STORAGE_KEYS.WISHLIST, productId);
    const isInCart = hasIdInStorage(STORAGE_KEYS.CART, productId);

    renderModalContent(
      refs.modalContent,
      createModalProductMarkup(product, isInWishlist, isInCart)
    );

    openModal();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load product details',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

export function onModalActionClick(event) {
  const btn = event.target.closest('button[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const productId = state.modalProductId;

  if (!productId) return;

  if (action === 'wishlist') {
    const { added } = toggleIdInStorage(STORAGE_KEYS.WISHLIST, productId);
    btn.textContent = added ? 'Remove from Wishlist' : 'Add to Wishlist';

    iziToast.success({
      title: 'Success',
      message: added ? 'Added to wishlist' : 'Removed from wishlist',
      position: 'topRight',
    });
  }

  if (action === 'cart') {
    const { added } = toggleIdInStorage(STORAGE_KEYS.CART, productId);
    btn.textContent = added ? 'Remove from Cart' : 'Add to Cart';

    iziToast.success({
      title: 'Success',
      message: added ? 'Added to cart' : 'Removed from cart',
      position: 'topRight',
    });
  }

  updateNavCounters();
}

export async function onSearchSubmit(event) {
  event.preventDefault();

  const query = refs.searchInput.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Enter product name',
      position: 'topRight',
    });
    return;
  }

  try {
    showLoader();
    hideNotFound();

    state.currentPage = 1;
    state.currentQuery = query;
    state.currentCategory = CATEGORY_ALL;
    state.mode = 'search';

    const data = await searchProducts(query, state.currentPage);
    state.total = data.total || data.products.length;

    if (!data.products.length) {
      refs.productsList.innerHTML = '';
      showNotFound();
      hideLoadMoreButton();
      return;
    }

    renderProducts(refs.productsList, createProductsMarkup(data.products));
    checkLoadMoreVisibility();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Search failed',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

export async function onClearSearchClick() {
  refs.searchInput.value = '';
  refs.clearSearchBtn?.classList.remove('is-visible');

  await loadInitialProducts();

  document
    .querySelectorAll('.categories__btn')
    .forEach(btn =>
      btn.classList.toggle(
        'categories__btn--active',
        btn.textContent.trim() === CATEGORY_ALL
      )
    );
}

export function onSearchInput() {
  const value = refs.searchInput.value.trim();
  refs.clearSearchBtn?.classList.toggle('is-visible', Boolean(value));
}

export function onScrollUpClick() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}