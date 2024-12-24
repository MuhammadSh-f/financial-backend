import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Instrument from "../models/Instrument";
import logger from "../utils/logger";

interface Query {
  $or?: { [key: string]: { $regex: string; $options: string } }[];
  type?: string;
  country?: string;
  currency?: string;
}

export const getInstruments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "name",
      order = "asc",
      type,
      country,
      currency,
    } = req.query;

    const query: Query = search
      ? {
          $or: [
            {
              name: {
                $regex: typeof search === "string" ? search : "",
                $options: "i",
              },
            },
            {
              symbol: {
                $regex: typeof search === "string" ? search : "",
                $options: "i",
              },
            },
            {
              type: {
                $regex: typeof search === "string" ? search : "",
                $options: "i",
              },
            },
          ],
        }
      : {};

    // Ensure type, country and currency are strings
    if (type) query.type = typeof type === "string" ? type : "";
    if (country) query.country = typeof country === "string" ? country : "";
    if (currency) query.currency = typeof currency === "string" ? currency : "";

    const sortOrder = order === "desc" ? -1 : 1;

    // Ensure sortBy is a valid key
    const allowedSortFields: Record<string, 1 | -1> = {
      name: sortOrder,
      symbol: sortOrder,
      type: sortOrder,
      country: sortOrder,
      currency: sortOrder,
    };

    const sortField: { [key: string]: 1 | -1 } = allowedSortFields[
      sortBy as string
    ]
      ? { [sortBy as string]: sortOrder === 1 ? 1 : -1 } // Convert to 1 or -1
      : { name: sortOrder === 1 ? 1 : -1 }; // Default to sorting by 'name'

    const instruments = await Instrument.find(query)
      .sort(sortField)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Instrument.countDocuments(query);

    res.status(200).json({
      data: instruments,
      total,
      page: +page,
      totalPages: Math.ceil(total / +limit),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to fetch instruments" });
  }
};
