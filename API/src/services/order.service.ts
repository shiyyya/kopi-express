import { ApiError } from "../utils/ApiError.js";
import { sequelize, CustomerAddress as CustomerAddressModel, Customer as CustomerModel, CartItem as CartItemModel, Product as ProductModel, CartItemAddOn as CartItemAddOnModel, AddOn as AddonModel, Order as OrderModel, OrderItem as OrderItemModel, OrderItemAddOn as OrderItemAddOnModel} from "../models/index.js";
import { newOrderInput } from "../validators/order.validator.js";
import { includes } from "zod/v4";
import { OrderStatus } from "../constants/order.js";

export async function getOrders(status: OrderStatus) {
  const orders = await OrderModel.findAll({
    where: { status: status },
    include: [
      { model: CustomerModel, attributes: ['fullName'], },
      { model: OrderItemModel, include: [
          { model: ProductModel, attributes: ['name'], },
          { model: OrderItemAddOnModel, include: [ { model: AddonModel, attributes: ['name'], }, 
  ]}]}]});

  if (orders.length === 0) throw new ApiError( 404, 'No pending orders found', 'NO_PENDING_ORDERS_FOUND' );

  return orders.map((order) => {
    const data = order.toJSON() as any;
    let total = Number(data.deliveryFee ?? 0);

    const items = data.OrderItems.map((item: any) => {
      total += Number(item.unitPrice) * item.quantity;

      const addons = item.OrderItemAddOns.map((addon: any) => {
        total += Number(addon.unitPrice);

        return {
          name: addon.AddOn.name,
          unitPrice: Number(addon.unitPrice),
        };
      });

      return {
        name: item.Product.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        addons,
      };
    });

    return {
      id: data.id,
      customerName: data.Customer.fullName,
      fulfillmentType: data.fulfillmentType,
      status: data.status,
      items,
      total,
    };
  });
}

export async function getOrder(orderId: string) {
  const order = await OrderModel.findByPk(orderId, {
    include: [
      { model: CustomerModel, attributes: ['fullName'], },
      { model: OrderItemModel, include: [
          { model: ProductModel, attributes: ['name'], },
          { model: OrderItemAddOnModel, include: [
              { model: AddonModel, attributes: ['name'], },
  ]}]}]});

  if (!order) throw new ApiError( 404, 'Order not found', 'ORDER_NOT_FOUND' );

  const data = order.toJSON() as any;

  const address = await CustomerAddressModel.findByPk( data.customerAddressId, { attributes: ['address'], } );
  if (!address) throw new ApiError( 404, 'Customer address not found', 'CUSTOMER_ADDRESS_NOT_FOUND' );

  let subtotal = 0;

  const items = data.OrderItems.map((item: any) => {
    const addons = item.OrderItemAddOns.map((addon: any) => {
      subtotal += Number(addon.unitPrice);

      return {
        name: addon.AddOn.name,
        unitPrice: Number(addon.unitPrice),
      };
    });

    subtotal += Number(item.unitPrice) * item.quantity;

    return {
      name: item.Product.name,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      addons,
    };
  });

  const deliveryFee = Number(data.deliveryFee ?? 0);

  return {
    id: data.id,
    customerName: data.Customer.fullName,
    status: data.status,
    fulfillmentType: data.fulfillmentType,
    address: address.address,
    paymentMethod: data.paymentMethod,
    paymentReference: data.paymentReference,
    notes: data.notes,
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}

export async function newOrder( userId: string, storeBranchId: string, input: newOrderInput ) {
  return sequelize.transaction(async (transaction) => {
    const cart = await CartItemModel.findAll({ where: { customerId: userId }, transaction });
    if (cart.length === 0) throw new ApiError( 404, 'No cart items found', 'NO_CART_ITEMS_FOUND' );

    const productIds = cart.map(cartItem => cartItem.productId);
    const products = await ProductModel.findAll({ where: { id: productIds }, attributes: ['id', 'price'], transaction });
    if (products.length !== new Set(productIds).size) throw new ApiError( 400, 'One or more products not found', 'PRODUCT_NOT_FOUND' );

    const cartItemIds = cart.map(cartItem => cartItem.id);
    const cartAddons = await CartItemAddOnModel.findAll({ where: { cartItemId: cartItemIds }, attributes: ['cartItemId', 'addOnId'], transaction });
    const addonIds = cartAddons.map(cartAddon => cartAddon.addOnId);
    const addons = await AddonModel.findAll({ where: { id: addonIds }, attributes: ['id', 'price'], transaction });
    if (addons.length !== new Set(addonIds).size) throw new ApiError( 400, 'One or more addons not found', 'ADDON_NOT_FOUND' );

    const order = await OrderModel.create({
      customerId: userId,
      customerAddressId: input.customerAddressId,
      storeBranchId,
      fulfillmentType: input.fulfillmentType,
      paymentMethod: input.paymentMethod,
      paymentReference: input.paymentReference,
      notes: input.notes,
      deliveryFee: 20,
    }, { transaction });

    const orderItems = await OrderItemModel.bulkCreate(
      cart.map(cartItem => {
        const product = products.find( product => product.id === cartItem.productId );
        if (!product) throw new ApiError( 400, 'Product not found', 'PRODUCT_NOT_FOUND' );

        return {
          orderId: order.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          unitPrice: product.price,
        };
    }), { transaction });

    const orderItemAddons = [];

    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i]!;
      const orderItem = orderItems[i]!;
      const itemAddons = cartAddons.filter( cartAddon => cartAddon.cartItemId === cartItem.id );

      for (const cartAddon of itemAddons) {
        const addon = addons.find( addon => addon.id === cartAddon.addOnId );
        if (!addon) throw new ApiError( 400, 'Addon not found', 'ADDON_NOT_FOUND' );

        orderItemAddons.push({
          orderItemId: orderItem.id,
          addOnId: addon.id,
          unitPrice: addon.price,
        });
      }
    }

    if (orderItemAddons.length > 0) await OrderItemAddOnModel.bulkCreate( orderItemAddons, { transaction } );
    await CartItemModel.destroy({ where: { customerId: userId }, transaction });
  });
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await OrderModel.findOne({ where: { id: orderId, customerId: userId, }, });
  if (!order) throw new ApiError( 404, 'Order not found', 'ORDER_NOT_FOUND' );

  if (['cancelled', 'declined'].includes(order.status)) throw new ApiError( 400, 'Order unavailable', 'ORDER_UNAVAILABLE' );
  if (order.status === 'pending') order.status = 'declined';
  else order.status = 'cancelled';

  await order.save();
}

export async function nextState(orderId: string) {
  const order = await OrderModel.findByPk(orderId);
  if (!order) throw new ApiError( 404, 'Order not found', 'ORDER_NOT_FOUND' );

  if (['cancelled', 'declined'].includes(order.status)) throw new ApiError( 400, 'Order unavailable', 'ORDER_UNAVAILABLE' );

  switch (order.status) {
    case 'pending':
      order.status = 'queued';
      break;

    case 'queued':
      order.status = 'preparing';
      break;

    case 'preparing':
      order.status = 'ready';
      break;

    case 'ready':
      order.status = 'completed';
      break;

    default:
      throw new ApiError( 400, 'Order cannot advance from its current status', 'INVALID_ORDER_STATUS' );
  }
}

//LACKING GET CERTAIN ORDER FOR CART