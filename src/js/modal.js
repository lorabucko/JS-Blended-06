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
  if (!refs.modal) return;

  refs.modal.classList.add('modal--is-open');
  document.addEventListener('keydown', onEscKeyPress);
  refs.modal.addEventListener('click', onBackdropClick);
}

export function closeModal() {
  if (!refs.modal) return;

  refs.modal.classList.remove('modal--is-open');
  document.removeEventListener('keydown', onEscKeyPress);
  refs.modal.removeEventListener('click', onBackdropClick);
}

export function initModalListeners() {
  refs.modalCloseBtn?.addEventListener('click', closeModal);
}