import { Router } from "express";
import { query } from "express-validator";
import { getInstruments } from "../controllers/instrumentController.js";

const router = Router();

router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("Limit must be a positive integer"),
    query("sortBy")
      .optional()
      .isIn(["name", "symbol", "type", "country", "currency"])
      .withMessage("Invalid sort field"),
    query("order")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Order must be either asc or desc"),
    query("search")
      .optional()
      .isString()
      .withMessage("Search must be a string"),
    query("type").optional().isString().withMessage("Type must be a string"),
    query("country")
      .optional()
      .isString()
      .withMessage("Country must be a string"),
    query("currency")
      .optional()
      .isString()
      .withMessage("Currency must be a string"),
  ],
  getInstruments
);
export default router;
