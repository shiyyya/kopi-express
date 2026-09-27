import { apiFetch } from './client.js';

export function getInventory() {
  return apiFetch('/inventory');
}

export function createStock(data) {
  return apiFetch('/inventory', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function incrementStock(name, quantity) {
  return apiFetch(`/inventory/${name}/increment`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export function deleteStock(name) {
  return apiFetch(`/inventory/${name}`, {
    method: 'DELETE',
  });
}

export function newStockToBranch(storeBranchId, data) {
  return apiFetch(`/inventory/branches/${storeBranchId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function decrementStock(name, quantity) {
  return apiFetch(`/inventory/${name}/decrement`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export function getBranchStocks(storeBranchId) {
  return apiFetch(`/inventory/branches/${storeBranchId}`);
}

export function deleteStockFromBranch(invItemId) {
  return apiFetch(`/inventory/items/${invItemId}`, {
    method: 'DELETE',
  });
}

export function incrementBranchStock(invItemId, quantity) {
  return apiFetch(`/inventory/items/${invItemId}/increment`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export function decrementBranchStock(invItemId, quantity) {
  return apiFetch(`/inventory/items/${invItemId}/decrement`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}