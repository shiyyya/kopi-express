import { apiFetch } from './client.js';

export function getIngredients() {
    return apiFetch('/inventory');
}

export function createIngredient(data) {
    return apiFetch('/inventory', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function updateIngredient(ingredientId, data) {
    return apiFetch(`/inventory/ingredients/${ingredientId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export function deleteIngredient(ingredientId) {
    return apiFetch(`/inventory/ingredients/${ingredientId}`, {
        method: 'DELETE',
    });
}

export function newStockToBranch(storeBranchId, data) {
    return apiFetch(`/inventory/branches/${storeBranchId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function getBranchStocks(storeBranchId) {
    return apiFetch(`/inventory/branches/${storeBranchId}`);
}

export function getOwnBranchStocks() {
    return apiFetch('/inventory/branches/ownStoreBranch');
}

export function newOwnBranchStock(data) {
    return apiFetch('/inventory/branches/ownStoreBranch', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function deleteStockFromBranch(invItemId) {
    return apiFetch(`/inventory/items/${invItemId}`, {
        method: 'DELETE',
    });
}