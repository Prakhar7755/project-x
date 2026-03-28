import express from "express";
import {
  bulkCreateUsers,
  bulkUpdateUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/bulk-create", bulkCreateUsers);

router.put("/bulk-update", bulkUpdateUsers);

export default router;
