import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const checkHealth = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const dbStatus =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.status(200).json({
      status: "ok",
      database: dbStatus,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to check health" });
  }
};
