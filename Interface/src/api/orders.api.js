import { apiFetch } from "./client.js";

export async function createOrder(payload) {
    const { data } = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return data;
}

export async function getCustomerOrders() {
    const { data } = await apiFetch("/orders/customer");
    return data.orders || [];
}

export async function getCustomerOrder(orderId) {
    const { data } = await apiFetch(`/orders/customer/${orderId}`);
    return data.order;
}