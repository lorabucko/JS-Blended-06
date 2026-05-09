import { refs } from './refs.js';

function onEscKeyPress(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

function onBackdropClick(event) {
  if (event.target === refs.modal) {
    closeModal();
  }
}

export function openModal() {
  refs.modal.classList.add('modal--is-open');
  document.addEventListener('keydown', onEscKeyPress);
  refs.modal.addEventListener('click', onBackdropClick);
}

export function closeModal() {
  refs.modal.classList.remove('modal--is-open');
  document.removeEventListener('keydown', onEscKeyPress);
  refs.modal.removeEventListener('click', onBackdropClick);
}

export function initModal() {
  if (refs.modalCloseBtn) {
    refs.modalCloseBtn.addEventListener('click', closeModal);
  }
}