import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import * as orderService from "../services/order.service.js";
import { assertAuth } from "../utils/assertions.js";
import { newOrderInput } from "../validators/order.validator.js";

// for pending orders and in-queue orders
export const getOrders: RequestHandler = asyncHandler( async (request, response) => {
  assertAuth(request.user);
  const storeBranchId = request.query.storeBranchId as string;
  // pending or in-queue orders, pag wala edi all orders!!!
  const orderView = request.query.orderView as 'pending' | 'in_queue';
  const orders = await orderService.getOrders(storeBranchId, orderView);
  response.status(200).json({ data: { orders } });
});

// for selected order, more details of order
export const getOrder: RequestHandler = asyncHandler( async (request, response) => {
  assertAuth(request.user);
  const orderId = request.params.orderId as string;
  const order = await orderService.getOrder(orderId);
  response.status(200).json({ data: { order } });
});

export const newOrder: RequestHandler = asyncHandler( async (request, response) => {
  const userId = assertAuth(request.user).id;
  const result = await orderService.newOrder(userId, request.body as newOrderInput);
  response.status(201).json({ data: result });
})

// for order history page
export const getCustomerOrders: RequestHandler = asyncHandler( async (request, response) => {
  const userId = assertAuth(request.user).id;
  const orders = await orderService.getCustomerOrders(userId);
  response.status(200).json({ data: { orders } });
})

// for order status page and maybe for selected order in order history
export const getCustomerOrder: RequestHandler = asyncHandler( async (request, response) => {
  const userId = assertAuth(request.user).id;
  const orderId = request.params.orderId as string;
  const order = await orderService.getCustomerOrder(userId, orderId);
  response.status(200).json({ data: { order } });
})

export const advanceOrder: RequestHandler = asyncHandler( async (request, response) => {
  assertAuth(request.user);
  const orderId = request.params.orderId as string;
  const order = await orderService.advanceOrder(orderId);
  response.status(200).json({ data: { order } });
})

export const declineOrCancelOrder: RequestHandler = asyncHandler( async (request, response) => {
  assertAuth(request.user);
  const orderId = request.params.orderId as string;
  const order = await orderService.declineOrCancelOrder(orderId);
  response.status(200).json({ data: { order } });
})