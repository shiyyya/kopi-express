import { apiFetch } from "./client";

export async function getAddOns() {
  const { data } = await apiFetch('/addons');
  const list = data.addOns ?? data.addons ?? [];
  return list.map((addOn) => ({
    id: addOn.id,
    name: addOn.name,
    price: Number(addOn.price),
  }));
}