import type { RequestHandler } from "express";
import * as salesRepService from "../services/sales-rep.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { assertAuth } from "../utils/assertions.js";

export const getSalesReport: RequestHandler = asyncHandler(async (request, response) => {
  const user = assertAuth(request.user);
  const storeBranchId = request.query.storeBranchId as string | undefined;
  const startDate = request.query.startDate as string | undefined;
  const endDate = request.query.endDate as string | undefined;
  const result = await salesRepService.getSalesReport(user, storeBranchId, startDate, endDate);
  response.json(result);
});