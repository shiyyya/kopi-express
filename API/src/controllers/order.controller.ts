import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import * as orderService from "../services/order.service.js";
import { assertAuth } from "../utils/assertions.js";
import { newOrderInput } from "../validators/order.validator.js";
import { geocodeAddress } from "../services/geocoding.service.js";

export const getOrders: RequestHandler = asyncHandler(async (request, response) => {
    assertAuth(request.user);
    const storeBranchId = request.query.storeBranchId as string;
    const orderView = request.query.orderView as "pending" | "in_queue";
    const orders = await orderService.getOrders(storeBranchId, orderView);
    response.status(200).json({ data: { orders } });
});

export const getOrder: RequestHandler = asyncHandler(async (request, response) => {
    assertAuth(request.user);
    const orderId = request.params.orderId as string;
    if (!orderId) throw new ApiError(400, "Order ID is required", "ORDER_ID_REQUIRED");
    const order = await orderService.getOrder(orderId);
    response.status(200).json({ data: { order } });
});

export const newOrder: RequestHandler = asyncHandler(async (request, response) => {
    const userId = assertAuth(request.user).id;
    const result = await orderService.newOrder(userId, request.body as newOrderInput);
    response.status(201).json({ data: result });
});

export const getCustomerOrders: RequestHandler = asyncHandler(async (request, response) => {
    const userId = assertAuth(request.user).id;
    const orders = await orderService.getCustomerOrders(userId);
    response.status(200).json({ data: { orders } });
});

export const getCustomerActiveOrders: RequestHandler = asyncHandler(async (request, response) => {
    const userId = assertAuth(request.user).id;
    const orders = await orderService.getCustomerActiveOrders(userId);
    response.status(200).json({ data: { orders } });
});

export const getCustomerOrder: RequestHandler = asyncHandler(async (request, response) => {
    const userId = assertAuth(request.user).id;
    const orderId = request.params.orderId as string;
    if (!orderId) throw new ApiError(400, "Order ID is required", "ORDER_ID_REQUIRED");
    const order = await orderService.getCustomerOrder(userId, orderId);
    response.status(200).json({ data: { order } });
});

export const checkDeliveryEligibility: RequestHandler = asyncHandler(async (request, response) => {
    assertAuth(request.user);
    const address = String(request.query.address || "").trim();
    if (!address) throw new ApiError(400, "Address is required", "ADDRESS_REQUIRED");
    const location = await geocodeAddress(address);
    const municipality = location?.municipality?.trim().toLowerCase();
    const province = location?.province?.trim().toLowerCase();
    const eligible = municipality === "pandi" && province === "bulacan";
    response.status(200).json({
        data: {
            eligible,
            municipality: location?.municipality ?? null,
            province: location?.province ?? null,
            barangay: location?.barangay ?? null
        }
    });
});

export const advanceOrder: RequestHandler = asyncHandler(async (request, response) => {
    assertAuth(request.user);
    const orderId = request.params.orderId as string;
    if (!orderId) throw new ApiError(400, "Order ID is required", "ORDER_ID_REQUIRED");
    const order = await orderService.advanceOrder(orderId);
    response.status(200).json({ data: { order } });
});

export const declineOrCancelOrder: RequestHandler = asyncHandler(async (request, response) => {
    assertAuth(request.user);
    const orderId = request.params.orderId as string;
    if (!orderId) throw new ApiError(400, "Order ID is required", "ORDER_ID_REQUIRED");
    const order = await orderService.declineOrCancelOrder(orderId);
    response.status(200).json({ data: { order } });
});