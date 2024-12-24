import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Instrument from "../models/Instrument";
import fs from "fs";
import path from "path";
import logger from "../utils/logger";

interface ExchangeSource {
  symbol: string;
  type?: string;
  name?: string;
  currency?: string;
  region?: string;
  country?: string;
  isin?: string;
}

interface Exchange {
  _source: ExchangeSource;
}

interface MetadataSource {
  symbol: string;
  technicals?: Record<string, unknown>;
  performance?: Record<string, unknown>;
}

interface Metadata {
  _source: MetadataSource;
}

interface CandleSource {
  symbol: string;
  dateTime: string;
  startPrice: number;
  endPrice: number;
  volume: number;
}

interface Candle {
  _source: CandleSource;
}

interface Instrument {
  symbol: string;
  type: string;
  name: string;
  currency: string;
  region: string;
  country: string;
  isin: string;
  data: ExchangeSource;
  technicals: Record<string, unknown>;
  performance: Record<string, unknown>;
  candleData: CandleSource[];
}

export const importData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    // File paths
    const filePaths = [
      path.join(__dirname, "../../data/exchange.json"),
      path.join(__dirname, "../../data/metadata.json"),
      path.join(__dirname, "../../data/candle.json"),
    ];

    // Check file existence
    for (const filePath of filePaths) {
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: `File not found: ${filePath}` });
        return;
      }
    }

    // Read and parse files
    const [exchangeData, metadataData, candleData] = filePaths.map(
      (filePath) => {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileContent);
      }
    );

    // Map and merge data
    const instruments: Instrument[] = exchangeData.hits.hits.map(
      (exchange: Exchange) => {
        const symbol = exchange._source.symbol;

        // Find metadata for the symbol
        const metadata = metadataData.hits.hits.find(
          (meta: Metadata) => meta._source.symbol === symbol
        )?._source;

        // Filter candles for the symbol
        const candles = candleData.hits.hits
          .filter((candle: Candle) => candle._source.symbol === symbol)
          .map((candle: Candle) => ({
            dateTime: candle._source.dateTime,
            startPrice: candle._source.startPrice,
            endPrice: candle._source.endPrice,
            volume: candle._source.volume,
          }));

        return {
          symbol,
          type: exchange._source.type || "unknown",
          name: exchange._source.name || "unknown",
          currency: exchange._source.currency || "unknown",
          region: exchange._source.region || "unknown",
          country: exchange._source.country || "unknown",
          isin: exchange._source.isin || "",
          data: exchange._source,
          technicals: metadata?.technicals || {},
          performance: metadata?.performance || {},
          candleData: candles,
        };
      }
    );

    // Insert data into the database
    await Instrument.insertMany(instruments);

    res.status(200).json({ message: "All data imported successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to import data" });
  }
};
