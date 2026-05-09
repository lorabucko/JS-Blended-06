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

export function addIdToStorage(key, id) {
  const items = load(key, []);

  if (items.includes(id)) return items;

  const updatedItems = [...items, id];
  save(key, updatedItems);
  return updatedItems;
}

export function removeIdFromStorage(key, id) {
  const items = load(key, []);
  const updatedItems = items.filter(item => item !== id);
  save(key, updatedItems);
  return updatedItems;
}

export function hasIdInStorage(key, id) {
  const items = load(key, []);
  return items.includes(id);
}

export function toggleIdInStorage(key, id) {
  const items = load(key, []);

  if (items.includes(id)) {
    const updated = items.filter(item => item !== id);
    save(key, updated);
    return { updated, added: false };
  }

  const updated = [...items, id];
  save(key, updated);
  return { updated, added: true };
}