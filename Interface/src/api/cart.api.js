import { apiFetch, API_ORIGIN } from "./client";

function resolveImageUrl(raw) {
  if (!raw) return "";
  if (/^(https?:)?\/\//.test(raw) || raw.startsWith("data:")) return raw;
  return `${API_ORIGIN}${raw.startsWith("/") ? "" : "/"}${raw}`;
}

function toCartItem(row) {
  return {
    id: row.id,
    quantity: row.quantity,
    temperature: row.productTemp,
    product: row.Product && {
      id: row.Product.id,
      name: row.Product.name,
      price: Number(row.Product.price),
      image: resolveImageUrl(row.Product.imageUrl),
    },
    addOns: (row.CartItemAddOns ?? []).map(({ AddOn }) => ({
      id: AddOn.id,
      name: AddOn.name,
      price: Number(AddOn.price),
    })),
  };
}

export async function getCart() {
  const { data } = await apiFetch('/cart');
  return data.cart.map(toCartItem);
}

export async function addToCart({ productId, quantity, addonIds, temperature }) {
  const payload = { productId, quantity, addonIds, ...(temperature && { productTemp: temperature }) };
  const { data } = await apiFetch('/cart', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.cartItem;
}

export function removeCartItem(id) {
  return apiFetch(`/cart/${id}`, { method: 'DELETE' });
}

export function clearCart() {
  return apiFetch('/cart', { method: 'DELETE' });
}