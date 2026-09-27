import { User } from "../models/User.js";
import { ApiError } from "./ApiError.js";

export function assertAuth(requestedUser: User | undefined) {
  if (!requestedUser) throw new ApiError(401, 'Authentication required', 'UNAUTHORIZED');
  return requestedUser;
}