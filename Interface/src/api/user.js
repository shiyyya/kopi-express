import { apiFetch } from "./client.js";

export async function getCurrentUser() {
    const { data } = await apiFetch("/users/me");
    return data;
}

export async function addCustomerAddress(address) {
    const { data } = await apiFetch("/users/me", {
        method: "POST",
        body: JSON.stringify({ address }),
    });
    return data;
}

export async function removeCustomerAddress(addressId) {
    return apiFetch(`/users/me/addresses/${addressId}`, {
        method: "DELETE",
    });
}