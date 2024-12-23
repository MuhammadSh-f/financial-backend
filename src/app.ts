import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import instrumentRoutes from "./routes/instrumentRoutes";
import dataImportRoutes from "./routes/dataImportRoutes";
import logger from "./utils/logger";
import { healthCheck } from "./routes/healthRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: "10mb" })); // Handle large JSON payloads
app.use(cors());

// Routes
app.use("/api/instruments", instrumentRoutes);
app.use("/api/import", dataImportRoutes);
app.use("/api/health", healthCheck);

// Database Connection
const connectWithRetry = () => {
  mongoose
    .connect(process.env.MONGO_URI || "")
    .then(() => {
      logger.info("MongoDB connected");
      app.listen(PORT, () =>
        logger.info(`Server running at http://localhost:${PORT}`)
      );
    })
    .catch((err) => {
      logger.error(`Error connecting to MongoDB: ${err}`);
      logger.info("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

export default app;
