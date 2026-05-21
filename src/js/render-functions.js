import { refs } from './refs.js';
import { STORAGE_KEYS, TEXT } from './constants.js';
import { getStoredIds, hasIdInStorage } from './storage.js';

export const createCategoryMarkup = category => `
  <li class="categories__item">
    <button class="categories__btn" type="button">${category}</button>
  </li>
`;

export const renderCategories = categories => {
  if (!refs.categoriesList) return;

  refs.categoriesList.innerHTML = categories
    .map(createCategoryMarkup)
    .join('');
};

export const createProductCardMarkup = product => {
  const { id, thumbnail, title, brand, category, price } = product;

  return `
    <li class="products__item" data-id="${id}">
      <img class="products__image" src="${thumbnail}" alt="${title}" />
      <p class="products__title">${title}</p>
      <p class="products__brand">
        <span class="products__brand--bold">Brand:</span> ${brand}
      </p>
      <p class="products__category">Category: ${category}</p>
      <p class="products__price">Price: $${price}</p>
    </li>
  `;
};

export const renderProducts = (products, { append = false } = {}) => {
  if (!refs.productsList) return;

  const markup = products.map(createProductCardMarkup).join('');

  if (append) {
    refs.productsList.insertAdjacentHTML('beforeend', markup);
    return;
  }

  refs.productsList.innerHTML = markup;
};

export const clearProductsList = () => {
  if (!refs.productsList) return;
  refs.productsList.innerHTML = '';
};

export const createModalProductMarkup = product => {
  const {
    id,
    thumbnail,
    title,
    brand,
    category,
    description,
    shippingInformation,
    returnPolicy,
    price,
  } = product;

  const isInWishlist = hasIdInStorage(STORAGE_KEYS.wishlist, id);
  const isInCart = hasIdInStorage(STORAGE_KEYS.cart, id);

  return `
    <img
      class="modal-product__img"
      src="${thumbnail}"
      alt="${title}"
    />
    <div class="modal-product__content" data-id="${id}">
      <h2 class="modal-product__title">${title}</h2>
      <p class="modal-product__tags">${category} | ${brand}</p>
      <p class="modal-product__description">${description}</p>
      <p class="modal-product__shipping-information">
        Shipping: ${shippingInformation ?? 'Free shipping'}
      </p>
      <p class="modal-product__return-policy">
        Return Policy: ${returnPolicy ?? '14 days return'}
      </p>
      <p class="modal-product__price">Price: $${price}</p>

      <div class="modal-product__actions">
        <button
          class="modal-product__btn"
          type="button"
          data-action="wishlist"
        >
          ${isInWishlist ? TEXT.removeFromWishlist : TEXT.addToWishlist}
        </button>

        <button
          class="modal-product__btn"
          type="button"
          data-action="cart"
        >
          ${isInCart ? TEXT.removeFromCart : TEXT.addToCart}
        </button>
      </div>
    </div>
  `;
};

export const renderModalProduct = product => {
  if (!refs.modalProduct) return;
  refs.modalProduct.innerHTML = createModalProductMarkup(product);
};

export const clearModalProduct = () => {
  if (!refs.modalProduct) return;
  refs.modalProduct.innerHTML = '';
};

export const renderCounters = () => {
  const cartItems = getStoredIds(STORAGE_KEYS.cart);
  const wishlistItems = getStoredIds(STORAGE_KEYS.wishlist);

  if (refs.cartCount) {
    refs.cartCount.textContent = cartItems.length;
  }

  if (refs.wishlistCount) {
    refs.wishlistCount.textContent = wishlistItems.length;
  }
};

export const renderCartSummary = products => {
  const totalItems = products.length;
  const totalPrice = products.reduce((total, product) => {
    return total + Number(product.price);
  }, 0);

  if (refs.cartItemsCount) {
    refs.cartItemsCount.textContent = totalItems;
  }

  if (refs.cartTotalPrice) {
    refs.cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  }
};