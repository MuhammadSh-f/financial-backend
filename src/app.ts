import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import instrumentRoutes from "./routes/instrumentRoutes";
import dataImportRoutes from "./routes/dataImportRoutes";
import logger from "./utils/logger";
import { healthCheck } from "./routes/healthRoutes";
import { connectToMongo } from "./utils/mongoConnection";

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
connectToMongo();

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    logger.info(`Server running at http://localhost:${PORT}`)
  );
}

export default app;
