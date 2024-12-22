import mongoose, { Schema, Document } from "mongoose";

export interface IInstrument extends Document {
  symbol: string;
  type: string;
  name: string;
  currency: string;
  region: string;
  country: string;
  isin: string;
  data: Record<string, unknown>;
  technicals?: {
    beta?: number;
    high52Week?: number;
    low52Week?: number;
  };
  performance?: {
    returns1Y?: number;
    returnsYtd?: number;
  };
  candleData?: {
    dateTime: string;
    startPrice: number;
    endPrice: number;
    volume: number;
  }[];
}

const InstrumentSchema: Schema = new Schema(
  {
    symbol: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    currency: { type: String, required: true },
    region: { type: String },
    country: { type: String },
    isin: { type: String },
    data: { type: Schema.Types.Mixed },
    technicals: {
      beta: { type: Number },
      high52Week: { type: Number },
      low52Week: { type: Number },
    },
    performance: {
      returns1Y: { type: Number },
      returnsYtd: { type: Number },
    },
    candleData: [
      {
        dateTime: { type: String },
        startPrice: { type: Number },
        endPrice: { type: Number },
        volume: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IInstrument>("Instrument", InstrumentSchema);
