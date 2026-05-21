import { refs } from './refs.js';

export function showLoader() {
  refs.loader?.classList.add('loader--visible');
}

export function hideLoader() {
  refs.loader?.classList.remove('loader--visible');
}

export function showNotFound() {
  refs.notFound?.classList.add('not-found--visible');
}

export function hideNotFound() {
  refs.notFound?.classList.remove('not-found--visible');
}

export function toggleLoadMoreButton(isVisible) {
  refs.loadMoreBtn?.classList.toggle('is-hidden', !isVisible);
}

export function smoothScrollUp() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function getProductIdFromEvent(event) {
  const productCard = event.target.closest('.products__item');
  return productCard ? Number(productCard.dataset.id) : null;
}

export function isAllCategory(category) {
  return category.trim().toLowerCase() === 'all';
}

export function isValidSearchQuery(query) {
  return query.trim().length > 0;
}

export function setActiveCategoryButton(activeButton) {
  const buttons = refs.categoriesList?.querySelectorAll('.categories__btn');

  buttons?.forEach(button => {
    button.classList.toggle(
      'categories__btn--active',
      button === activeButton
    );
  });
}

export function notifyInfo(message) {
  if (window.iziToast) {
    window.iziToast.info({
      message,
      position: 'topRight',
    });
  }
}

export function notifySuccess(message) {
  if (window.iziToast) {
    window.iziToast.success({
      message,
      position: 'topRight',
    });
  }
}

export function notifyError(message) {
  if (window.iziToast) {
    window.iziToast.error({
      message,
      position: 'topRight',
    });
  }
}