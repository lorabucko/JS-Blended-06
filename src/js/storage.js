import { STORAGE_KEYS } from './constants.js';

export function load(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredIds(key) {
  return load(key, []);
}

export function addIdToStorage(key, id) {
  const normalizedId = Number(id);
  const items = load(key, []);

  if (items.includes(normalizedId)) {
    return items;
  }

  const updatedItems = [...items, normalizedId];
  save(key, updatedItems);
  return updatedItems;
}

export function removeIdFromStorage(key, id) {
  const normalizedId = Number(id);
  const items = load(key, []);
  const updatedItems = items.filter(item => item !== normalizedId);

  save(key, updatedItems);
  return updatedItems;
}

export function hasIdInStorage(key, id) {
  const normalizedId = Number(id);
  const items = load(key, []);
  return items.includes(normalizedId);
}

export function toggleIdInStorage(key, id) {
  const normalizedId = Number(id);
  const items = load(key, []);

  if (items.includes(normalizedId)) {
    const ids = items.filter(item => item !== normalizedId);
    save(key, ids);
    return { ids, isAdded: false };
  }

  const ids = [...items, normalizedId];
  save(key, ids);
  return { ids, isAdded: true };
}

export function getTheme() {
  return load(STORAGE_KEYS.theme, 'light');
}

export function setTheme(theme) {
  save(STORAGE_KEYS.theme, theme);
}