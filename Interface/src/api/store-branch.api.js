import { apiFetch } from "./client";

export function getStoreBranches() {
    return apiFetch("/store-branches");
}