import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import instrumentRoutes from "./routes/instrumentRoutes";
import dataImportRoutes from "./routes/dataImportRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "10mb" })); // Handle large JSON payloads
app.use(cors());

// Routes
app.use("/api/instruments", instrumentRoutes);
app.use("/api/import", dataImportRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(`Error connecting to MongoDB: ${err}`));

export default app;
