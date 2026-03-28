import { body } from "express-validator";

const bulkCreateUserValidator = [
  body().isArray().withMessage("Request body must be an array"),
  body("*.fullName").notEmpty().withMessage("fullName is required"),
  body("*.email").isEmail().withMessage("Invalid email"),
  body("*.phone").notEmpty().withMessage("Phone is required"),
];

const bulkUpdateUserValidator = [
  body().isArray().withMessage("Request body must be an array"),
  body("*._id").notEmpty().withMessage("_id is required"),
];

export {
  bulkCreateUserValidator,
  bulkUpdateUserValidator,
}