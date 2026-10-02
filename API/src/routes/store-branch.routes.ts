import { Router } from "express";
import * as controller from "../controllers/store-branch.controller.js";

export const storeBranchRouter = Router();

storeBranchRouter.get("/", controller.getStoreBranches);