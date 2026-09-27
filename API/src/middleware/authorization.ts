import type { RequestHandler } from "express";
import type { UserRole } from "../constants/user.js";
import { assertAuth } from "../utils/assertions.js";
import { ApiError } from "../utils/ApiError.js";

export const requireRole = (...roles: UserRole[]): RequestHandler => (request, _response, next) => {
    const user = assertAuth(request.user);
    if (!roles.includes(user.role)) throw new ApiError(403, 'No Permission', 'NO_PERMISSION');
    next()
}
