import { apiFetch, API_ORIGIN } from "./client";

function withImageUrl(product) {
  return {
    ...product,
    image_url: `${API_ORIGIN}${product.image_url}`,
  };
}

export async function getProduct(id) {
  const { data } = await apiFetch(`/products/${id}`);
  return {
    data: {
      product: withImageUrl(data.product),
    },
  };
}

export async function getAllProducts(category) {
  const query = category ? `?category=${category}` : '';
  const { data } = await apiFetch(`/products${query}`);
  return {
    data: {
      products: data.products.map(withImageUrl),
    },
  };
}