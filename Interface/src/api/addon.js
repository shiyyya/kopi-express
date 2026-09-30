import { apiFetch } from "./client.js";

export async function getAddOns() {
    const { data } = await apiFetch("/addons");
    const list = data.addOns ?? data.addons ?? [];
    return list.map((addOn) => ({
        id: addOn.id,
        name: addOn.name,
        price: Number(addOn.price),
    }));
}

export function getAllAddons() {
    return apiFetch("/addons");
}

export function getAddon(id) {
    return apiFetch(`/addons/${id}`);
}

export function createAddon(data) {
    return apiFetch("/addons", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function updateAddon(id, data) {
    return apiFetch(`/addons/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export function deleteAddon(id) {
    return apiFetch(`/addons/${id}`, {
        method: "DELETE",
    });
}

export function getAddOnIngredients(id) {
    return apiFetch(`/addons/${id}/ingredients`);
}

export function addAddOnIngredient(id, ingredient) {
    return apiFetch(`/addons/${id}/ingredients`, {
        method: "POST",
        body: JSON.stringify({
            ingredientId: ingredient.ingredientId,
            quantityRequired: ingredient.quantityRequired,
        }),
    });
}

export function removeAddOnIngredient(id, ingredientId) {
    return apiFetch(`/addons/${id}/ingredients/${ingredientId}`, {
        method: "DELETE",
    });
}