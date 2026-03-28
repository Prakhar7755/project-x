import express from "express";
import {
  bulkCreateUsers,
  bulkUpdateUsers,
} from "../controllers/user.controller.js";

import {
  bulkCreateUserValidator,
  bulkUpdateUserValidator,
} from "../middlewares/validators.js";
import { validateResult } from "../middlewares/validateResult.js";
import { bulkApiLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post(
  "/bulk-create",
  bulkApiLimiter,
  bulkCreateUserValidator,
  validateResult,
  bulkCreateUsers,
);

router.put(
  "/bulk-update",
  bulkApiLimiter,
  bulkUpdateUserValidator,
  validateResult,
  bulkUpdateUsers,
);

export default router;
