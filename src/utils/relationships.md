- **Symbol**: Unique identifier that connects all three data sources.
- **ISIN**: Secondary identifier when available.

## Data Flow

1. **Exchange Metadata** (`exchange.json`)

   - General details of financial instruments.
   - Contains name, type, and associated exchange.

2. **Performance & Technicals** (`metadata.json`)

   - Adds details like 52-week highs, beta, and returns.

3. **Historical Pricing Data** (`candle.json`)
   - Time-series data with open, close, high, low prices, and volume.

## Example Record (Symbol: `PL.COMM`)

- **exchange.json**:

  - Name: "Platinum Commodity"
  - Type: "Commodity"
  - Currency: "USD"

- **metadata.json**:

  - 52WeekHigh: 1025
  - 52WeekLow: 895
  - Returns1Y: 12.5%

- **candle.json**:
  - 2023-01-01: { Start: 910, End: 920, Volume: 5000 }
  - 2023-01-02: { Start: 920, End: 930, Volume: 6000 }

## Relationships Diagram

```
exchange.json ---> metadata.json ---> candle.json
     [Symbol]          [Symbol]          [Symbol]
```
