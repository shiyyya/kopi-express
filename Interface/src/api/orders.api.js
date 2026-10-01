import { apiFetch } from "./client.js";

export async function createOrder(payload) {
    const { data } = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return data; 
}