import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as storeBranchService from "../services/store-branch.service.js";

export const getStoreBranches: RequestHandler = asyncHandler(async (_request, response) => {
    const branches = await storeBranchService.getStoreBranches();
    response.status(200).json({ data: { branches } });
});