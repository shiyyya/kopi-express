import { apiFetch, API_ORIGIN } from "./client";

function withImageUrl(product) {
    return {
        ...product,
        image_url: product.imageUrl ? `${API_ORIGIN}${product.imageUrl}` : null,
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
    const query = category ? `?category=${category}` : "";
    const { data } = await apiFetch(`/products${query}`);
    return {
        data: {
            products: data.products.map(withImageUrl),
        },
    };
}

export async function createProduct(product) {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("description", product.description);
    formData.append("price", String(product.price));
    formData.append("isHotAvailable", String(product.isHotAvailable));
    formData.append("isIcedAvailable", String(product.isIcedAvailable));
    formData.append(
        "ingredients",
        JSON.stringify(
            product.ingredients.map((ingredient) => ({
                id: ingredient.id,
                quantity: ingredient.quantity,
            }))
        )
    );
    if (product.image) {
        formData.append("image", product.image);
    }
    const { data } = await apiFetch("/products", {
        method: "POST",
        body: formData,
    });
    return {
        data: {
            product: withImageUrl(data.product),
        },
    };
}

export async function updateProduct(id, product) {
    const formData = new FormData();
    if (product.name !== undefined) {
        formData.append("name", product.name);
    }
    if (product.category !== undefined) {
        formData.append("category", product.category);
    }
    if (product.description !== undefined) {
        formData.append("description", product.description);
    }
    if (product.price !== undefined) {
        formData.append("price", String(product.price));
    }
    if (product.isHotAvailable !== undefined) {
        formData.append("isHotAvailable", String(product.isHotAvailable));
    }
    if (product.isIcedAvailable !== undefined) {
        formData.append("isIcedAvailable", String(product.isIcedAvailable));
    }
    if (product.ingredients !== undefined) {
        formData.append(
            "ingredients",
            JSON.stringify(
                product.ingredients.map((ingredient) => ({
                    id: ingredient.id,
                    quantity: ingredient.quantity,
                }))
            )
        );
    }
    if (product.image instanceof File) {
        formData.append("image", product.image);
    }
    const { data } = await apiFetch(`/products/${id}`, {
        method: "PATCH",
        body: formData,
    });
    return {
        data: {
            product: withImageUrl(data.product),
        },
    };
}

export async function deleteProduct(id) {
    return apiFetch(`/products/${id}`, {
        method: "DELETE",
    });
}

export async function getProductIngredients(id) {
    const { data } = await apiFetch(`/products/${id}/ingredients`);
    return {
        data: {
            productIngredients: data.productIngredients,
        },
    };
}

export async function addProductIngredient(id, ingredient) {
    const { data } = await apiFetch(`/products/${id}/ingredients`, {
        method: "POST",
        body: JSON.stringify({
            ingredientId: ingredient.ingredientId,
            quantityRequired: ingredient.quantityRequired,
        }),
    });
    return {
        data: {
            productIngredient: data.productIngredient,
        },
    };
}

export async function removeProductIngredient(id, ingredientId) {
    return apiFetch(`/products/${id}/ingredients/${ingredientId}`, {
        method: "DELETE",
    });
}