import mongoose from "mongoose";
import logger from "./logger";

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Failed to connect to MongoDB", error);
    logger.info("Retrying connection in 5 seconds...");
    setTimeout(connectToMongo, 5000);
  }
};

const disconnectFromMongo = async () => {
  try {
    await mongoose.connection.close();
    logger.info("Disconnected from MongoDB");
  } catch (error) {
    logger.error("Failed to disconnect from MongoDB", error);
  }
};

export { connectToMongo, disconnectFromMongo };
