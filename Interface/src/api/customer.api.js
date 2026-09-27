import { apiFetch } from "./client";

export function getProfile() {
  return apiFetch('/users/me');
}

export function updateProfile(data) {
  return apiFetch('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function addAddress(newAddress) {
  return apiFetch('/users/me', {
    method: 'POST',
    body: JSON.stringify({ newAddress }),
  });
}

export function removeAddress(addressId) {
  return apiFetch(`/users/me/addresses/${addressId}`, {
    method: 'DELETE',
  });
}