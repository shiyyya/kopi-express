import { ApiError } from "../utils/ApiError.js";
import { sequelize, CartItem as CartItemModel, Product as ProductModel, CartItemAddOn as CartItemAddOnModel, AddOn as AddonModel} from "../models/index.js";
import { addToCartInput } from "../validators/cart.validator.js";

export async function getCart(userId: string) {
  const cart = await CartItemModel.findAll({ where: { customerId: userId } });
  if (cart.length === 0) throw new ApiError(404, 'No cart items found', 'NO_CART_ITEMS_FOUND');
  return cart;
}

export async function addToCart(userId: string, input: addToCartInput) { return sequelize.transaction(async (transaction) => {
  const product = await ProductModel.findByPk(input.productId, { attributes: ['id'], transaction });
  if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
  const addons = await AddonModel.findAll({ where: { id: input.addonIds }, attributes: ['id'], transaction });
  if (addons.length !== input.addonIds.length) throw new ApiError(400, 'One or more addons not found', 'ADDON_NOT_FOUND');

  const cartItem = await CartItemModel.create({
    customerId: userId,
    productId: input.productId,
    quantity: input.quantity,
  }, {transaction});

  await CartItemAddOnModel.bulkCreate(
    input.addonIds.map(addOnId => ({
      cartItemId: cartItem.id,
      addOnId,
    })), {transaction}
  );

  return cartItem;
})}

export async function removeCartItem(userId:string, id: string) {
  const deleted = await CartItemModel.destroy({ where: { id, customerId: userId } });
  if (deleted === 0) throw new ApiError(404, 'Cart item not found', 'CART_ITEM_NOT_FOUND');
}

export async function removeCart(userId: string) {
  const deleted = await CartItemModel.destroy({ where: { customerId: userId } });
  if (deleted === 0) throw new ApiError(404, 'Cart not found', 'CART_NOT_FOUND');
}