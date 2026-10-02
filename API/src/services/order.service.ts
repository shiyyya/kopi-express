import { ApiError } from "../utils/ApiError.js";

import {
    sequelize,
    CustomerAddress as CustomerAddressModel,
    Customer as CustomerModel,
    CartItem as CartItemModel,
    Product as ProductModel,
    CartItemAddOn as CartItemAddOnModel,
    AddOn as AddonModel,
    Order as OrderModel,
    OrderItem as OrderItemModel,
    OrderItemAddOn as OrderItemAddOnModel,
    StoreBranch as StoreBranchModel,
    InventoryLoan as InventoryLoanModel
} from "../models/index.js";
import { newOrderInput } from "../validators/order.validator.js";
import { deductOrderStock, restoreOrderStock } from "./inv.service.js";
import { Op } from "sequelize";
import { geocodeAddress } from "./geocoding.service.js";
import { getBranchesForArea, getClosestBranch } from "./store-branch.service.js";



export async function getOrders(storeBranchId?: string, orderView?: "pending" | "in_queue") {
    const orders = await OrderModel.findAll({
        where: {
            ...(storeBranchId ? { storeBranchId } : undefined),
            ...(orderView
                ? orderView === "pending"
                    ? { status: "pending" }
                    : { status: { [Op.ne]: "pending" } }
                : undefined)
        },
        include: [
            { model: CustomerModel, attributes: ["fullName"] },
            {
                model: OrderItemModel,
                include: [
                    { model: ProductModel, attributes: ["name"] },
                    {
                        model: OrderItemAddOnModel,
                        include: [{ model: AddonModel, attributes: ["name"] }]
                    }
                ]
            }
        ]
    });
    return orders.map((order) => {
        const data = order.toJSON() as any;
        let total = Number(data.deliveryFee ?? 0);
        const items = data.OrderItems.map((item: any) => {
            total += Number(item.unitPrice) * item.quantity;
            const addons = item.OrderItemAddOns.map((addon: any) => {
                total += Number(addon.unitPrice) * item.quantity;
                return {
                    name: addon.AddOn.name,
                    unitPrice: Number(addon.unitPrice)
                };
            });
            return {
                name: item.Product.name,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                addons
            };
        });
        return {
            id: data.id,
            orderNo: data.orderNo.toString().padStart(3, "0"),
            customerName: data.Customer.fullName,
            fulfillmentType: data.fulfillmentType,
            status: data.status,
            items,
            total
        };
    });
}

export async function getOrder(orderId: string) {
    const order = await OrderModel.findByPk(orderId, {
        include: [
            { model: CustomerModel, attributes: ["fullName"] },
            {
                model: OrderItemModel,
                include: [
                    { model: ProductModel, attributes: ["name"] },
                    {
                        model: OrderItemAddOnModel,
                        include: [{ model: AddonModel, attributes: ["name"] }]
                    }
                ]
            }
        ]
    });
    if (!order) {
        throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
    }
    const data = order.toJSON() as any;
    const address = data.customerAddressId
        ? await CustomerAddressModel.findByPk(data.customerAddressId, {
            attributes: ["address"]
        })
        : null;
    let subtotal = 0;
    const items = data.OrderItems.map((item: any) => {
        const addons = item.OrderItemAddOns.map((addon: any) => {
            subtotal += Number(addon.unitPrice) * item.quantity;
            return {
                name: addon.AddOn.name,
                unitPrice: Number(addon.unitPrice)
            };
        });
        subtotal += Number(item.unitPrice) * item.quantity;
        return {
            name: item.Product.name,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            addons
        };
    });
    const deliveryFee = Number(data.deliveryFee ?? 0);
    return {
        id: data.id,
        orderNo: data.orderNo.toString().padStart(3, "0"),
        customerName: data.Customer.fullName,
        status: data.status,
        fulfillmentType: data.fulfillmentType,
        address: address?.address ?? null,
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference,
        notes: data.notes,
        items,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee
    };
}

export async function newOrder( userId: string, input: newOrderInput ): Promise<{ orderId: string; branchName: string; address: string }> {
    return sequelize.transaction(async (transaction) => {
        let storeBranchId: string | null = null;
        let deliveryAddressId: string | null = null;
        let deliveryAddress: string | null = null;
        if (input.fulfillmentType === "self_pick_up") {
            if (!input.storeBranchId) {
                throw new ApiError(
                    400,
                    "Store branch is required for pickup",
                    "STORE_BRANCH_REQUIRED"
                );
            }
            storeBranchId = input.storeBranchId;
        }
        if (input.fulfillmentType === "delivery") {
            if (!input.customerAddressId) {
                throw new ApiError(
                    400,
                    "No delivery address selected. Please select a delivery address.",
                    "CUSTOMER_ADDRESS_REQUIRED"
                );
            }
            const customerAddress = await CustomerAddressModel.findOne({
                where: {
                    id: input.customerAddressId,
                    customerId: userId
                },
                transaction
            });
            if (!customerAddress) {
                throw new ApiError(
                    400,
                    "No delivery address yet. Please add one in Settings.",
                    "CUSTOMER_ADDRESS_REQUIRED"
                );
            }
            deliveryAddressId = customerAddress.id;
            deliveryAddress = customerAddress.address;
            const location = await geocodeAddress(customerAddress.address);
            if (!location?.barangay) {
                throw new ApiError(
                    400,
                    "Could not determine delivery area",
                    "AREA_NOT_FOUND"
                );
            }
            const branches = await getBranchesForArea(location.barangay);
            if (branches.length === 0) {
                throw new ApiError(
                    400,
                    "Address is outside our delivery area",
                    "AREA_NOT_WITHIN_REACH"
                );
            }
            const { closestBranchId } = await getClosestBranch(
                customerAddress.id,
                branches
            );
            storeBranchId = closestBranchId;
        }
        if (!storeBranchId) {
            throw new ApiError(
                500,
                "Store branch was not determined",
                "STORE_BRANCH_NOT_DETERMINED"
            );
        }
        const storeBranch = await StoreBranchModel.findByPk(storeBranchId, {
            transaction
        });
        if (!storeBranch) {
            throw new ApiError(
                404,
                "Store branch not found",
                "STORE_BRANCH_NOT_FOUND"
            );
        }
        if (storeBranch.status !== "open") {
            throw new ApiError(
                400,
                "Store branch is not open",
                "STORE_BRANCH_CLOSED"
            );
        }
        const cart = await CartItemModel.findAll({
            where: { customerId: userId },
            transaction
        });
        if (cart.length === 0) {
            throw new ApiError(
                404,
                "No cart items found",
                "NO_CART_ITEMS_FOUND"
            );
        }
        const productIds = cart.map((cartItem) => cartItem.productId);
        const products = await ProductModel.findAll({
            where: { id: productIds },
            attributes: ["id", "price", "category"],
            transaction
        });
        if (products.length !== new Set(productIds).size) {
            throw new ApiError(
                400,
                "One or more products not found",
                "PRODUCT_NOT_FOUND"
            );
        }
        const cartItemIds = cart.map((cartItem) => cartItem.id);
        const cartAddons = await CartItemAddOnModel.findAll({
            where: { cartItemId: cartItemIds },
            attributes: ["cartItemId", "addOnId"],
            transaction
        });
        const addonIds = cartAddons.map((cartAddon) => cartAddon.addOnId);
        const addons = await AddonModel.findAll({
            where: { id: addonIds },
            attributes: ["id", "price"],
            transaction
        });
        if (addons.length !== new Set(addonIds).size) {
            throw new ApiError(
                400,
                "One or more addons not found",
                "ADDON_NOT_FOUND"
            );
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayOrderCount = await OrderModel.count({ where: { storeBranchId, createdAt: { [Op.between]: [startOfDay, endOfDay] }}, transaction});
        const orderNo = todayOrderCount + 1;

        const order = await OrderModel.create({
            customerId: userId,
            customerAddressId: deliveryAddressId,
            storeBranchId,
            fulfillmentType: input.fulfillmentType,
            paymentMethod: input.paymentMethod,
            paymentReference: input.paymentReference ?? null,
            notes: input.notes,
            deliveryFee: input.fulfillmentType === "delivery" ? 50 : 0,
            orderNo,
        }, { transaction });
        const orderItems = await OrderItemModel.bulkCreate(
            cart.map((cartItem) => {
                const product = products.find(
                    (product) => product.id === cartItem.productId
                );
                if (!product) {
                    throw new ApiError(
                        400,
                        "Product not found",
                        "PRODUCT_NOT_FOUND"
                    );
                }
                return {
                    orderId: order.id,
                    productId: cartItem.productId,
                    productCategory: product.category,
                    quantity: cartItem.quantity,
                    unitPrice: product.price,
                    productTemp: cartItem.productTemp
                };
            }),
            { transaction }
        );
        const orderItemAddons = [];
        for (let i = 0; i < cart.length; i++) {
            const cartItem = cart[i]!;
            const orderItem = orderItems[i]!;
            const itemAddons = cartAddons.filter(
                (cartAddon) => cartAddon.cartItemId === cartItem.id
            );
            for (const cartAddon of itemAddons) {
                const addon = addons.find(
                    (addon) => addon.id === cartAddon.addOnId
                );
                if (!addon) {
                    throw new ApiError(
                        400,
                        "Addon not found",
                        "ADDON_NOT_FOUND"
                    );
                }
                orderItemAddons.push({
                    orderItemId: orderItem.id,
                    addOnId: addon.id,
                    unitPrice: addon.price
                });
            }
        }
        if (orderItemAddons.length > 0) {
            await OrderItemAddOnModel.bulkCreate(
                orderItemAddons,
                { transaction }
            );
        }
        await CartItemModel.destroy({
            where: { customerId: userId },
            transaction
        });
        return {
            orderId: order.id,
            orderNo: order.orderNo.toString().padStart(3, "0"),
            branchName: storeBranch.name,
            address: deliveryAddress ?? storeBranch.address
        };
    });
}

export async function declineOrCancelOrder(orderId: string) {
    return sequelize.transaction(async (transaction) => {
        const order = await OrderModel.findByPk(orderId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!order) {
            throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
        }
        if (order.status === "pending") {
            order.status = "declined";
        } else if (order.status === "queued") {
            await restoreOrderStock(order.id, transaction);
            order.status = "cancelled";
        } else {
            throw new ApiError(
                400,
                "Order cannot be declined or cancelled at its current status",
                "ORDER_CANNOT_BE_CANCELLED"
            );
        }
        await order.save({ transaction });
        return order;
    });
}

export async function advanceOrder(orderId: string) {
    return sequelize.transaction(async (transaction) => {
        const order = await OrderModel.findByPk(orderId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!order) {
            throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
        }
        if (order.status === "pending") {
            await deductOrderStock(
                order.id,
                order.storeBranchId,
                transaction
            );
            order.status = "queued";
        } else if (order.status === "queued") {
            await InventoryLoanModel.destroy({
                where: { orderId: order.id },
                transaction
            });
            order.status = "preparing";
        } else if (order.status === "preparing") {
            order.status = "ready";
        } else if (order.status === "ready") {
            order.status = "completed";
        } else {
            throw new ApiError(
                400,
                "Order cannot be advanced from its current status",
                "ORDER_CANNOT_BE_ADVANCED"
            );
        }
        await order.save({ transaction });
        return order;
    });
}

export async function getCustomerOrders(customerId: string) {
    const orders = await OrderModel.findAll({
        where: {
            customerId,
            status: {
                [Op.in]: ["completed", "declined", "cancelled"]
            }
        },
        order: [["createdAt", "DESC"]],
        include: [
            {
                model: OrderItemModel,
                include: [
                    { model: ProductModel, attributes: ["name", "imageUrl"] },
                    {
                        model: OrderItemAddOnModel,
                        include: [{ model: AddonModel, attributes: ["name"] }]
                    }
                ]
            }
        ]
    });
    return orders.map((order) => {
        const data = order.toJSON() as any;
        let total = Number(data.deliveryFee ?? 0);
        const items = data.OrderItems.map((item: any) => {
            total += Number(item.unitPrice) * item.quantity;
            const addons = item.OrderItemAddOns.map((addon: any) => {
                total += Number(addon.unitPrice) * item.quantity;
                return {
                    name: addon.AddOn.name,
                    unitPrice: Number(addon.unitPrice)
                };
            });
            return {
                name: item.Product.name,
                image: item.Product.imageUrl,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                addons
            };
        });
        return {
            id: data.id,
            orderNo: data.orderNo.toString().padStart(3, "0"),
            status: data.status,
            fulfillmentType: data.fulfillmentType,
            createdAt: data.createdAt,
            items,
            total
        };
    });
}

export async function getCustomerActiveOrders(customerId: string) {
    const orders = await OrderModel.findAll({
        where: {
            customerId,
            [Op.or]: [
                {
                    status: {
                        [Op.in]: ["pending", "queued", "preparing", "ready"]
                    }
                },
                {
                    status: "completed",
                    updatedAt: {
                        [Op.gte]: new Date(Date.now() - 5 * 60 * 1000)
                    }
                }
            ]
        },
        order: [["createdAt", "DESC"]],
        include: [
            {
                model: OrderItemModel,
                include: [
                    { model: ProductModel, attributes: ["name", "imageUrl"] },
                    {
                        model: OrderItemAddOnModel,
                        include: [{ model: AddonModel, attributes: ["name"] }]
                    }
                ]
            }
        ]
    });
    return Promise.all(orders.map(async (order) => {
        const data = order.toJSON() as any;
        let total = Number(data.deliveryFee ?? 0);
        const items = data.OrderItems.map((item: any) => {
            total += Number(item.unitPrice) * item.quantity;
            const addons = item.OrderItemAddOns.map((addon: any) => {
                total += Number(addon.unitPrice) * item.quantity;
                return {
                    name: addon.AddOn.name,
                    unitPrice: Number(addon.unitPrice)
                };
            });
            return {
                name: item.Product.name,
                image: item.Product.imageUrl,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                addons
            };
        });
        const address = data.customerAddressId
            ? await CustomerAddressModel.findByPk(data.customerAddressId, {
                attributes: ["address"]
            })
            : null;
        const storeBranch = await StoreBranchModel.findByPk(data.storeBranchId, {
            attributes: ["name", "address"]
        });
        return {
            id: data.id,
            orderNo: data.orderNo.toString().padStart(3, "0"),
            status: data.status,
            fulfillmentType: data.fulfillmentType,
            createdAt: data.createdAt,
            address: address?.address ?? null,
            store: {
                name: storeBranch?.name ?? null,
                address: storeBranch?.address ?? null
            },
            items,
            deliveryFee: Number(data.deliveryFee ?? 0),
            total
        };
    }));
}

export async function getCustomerOrder(customerId: string, orderId: string) {
    const order = await OrderModel.findOne({
        where: {
            id: orderId,
            customerId
        }
    });
    if (!order) {
        throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
    }
    const [customer, storeBranch, address, orderItems] = await Promise.all([
        CustomerModel.findByPk(order.customerId, {
            attributes: ["fullName"]
        }),
        StoreBranchModel.findByPk(order.storeBranchId, {
            attributes: ["name", "address"]
        }),
        order.customerAddressId
            ? CustomerAddressModel.findByPk(order.customerAddressId, {
                attributes: ["address"]
            })
            : null,
        OrderItemModel.findAll({
            where: { orderId: order.id },
            include: [
                { model: ProductModel, attributes: ["name", "imageUrl"] },
                {
                    model: OrderItemAddOnModel,
                    include: [{ model: AddonModel, attributes: ["name"] }]
                }
            ]
        })
    ]);
    const data = order.toJSON() as any;
    let subtotal = 0;
    const items = orderItems.map((item: any) => {
        const addons = item.OrderItemAddOns.map((addon: any) => {
            subtotal += Number(addon.unitPrice) * item.quantity;
            return {
                name: addon.AddOn.name,
                unitPrice: Number(addon.unitPrice)
            };
        });
        subtotal += Number(item.unitPrice) * item.quantity;
        return {
            name: item.Product.name,
            image: item.Product.imageUrl,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            addons
        };
    });
    const deliveryFee = Number(data.deliveryFee ?? 0);
    return {
        id: data.id,
        orderNo: data.orderNo.toString().padStart(3, "0"),
        customerName: customer?.fullName ?? null,
        status: data.status,
        fulfillmentType: data.fulfillmentType,
        createdAt: data.createdAt,
        address: address?.address ?? null,
        store: {
            name: storeBranch?.name ?? null,
            address: storeBranch?.address ?? null
        },
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference,
        notes: data.notes,
        items,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee
    };
}