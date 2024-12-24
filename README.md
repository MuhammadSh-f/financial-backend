# Financial Instruments Backend

This project provides a backend API to manage financial instruments, including features for importing data from JSON files, retrieving instruments with filters and pagination, and monitoring the application's health.

## Features

- **Instrument Management**: Retrieve financial instruments with pagination, sorting, and filtering.
- **Data Import**: Import financial instrument data from local JSON files.
- **Health Check**: Monitor the API and database status.
- **Testing**: Comprehensive unit and integration tests for all features.
- **Docker Support**: Containerized application with MongoDB integration.

---

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Environment Variables](#environment-variables)
5. [API Endpoints](#api-endpoints)
6. [Testing](#testing)
7. [Deployment](#deployment)

---

## Technologies Used

- **Node.js** with TypeScript
- **Express.js** for API development
- **MongoDB** for data storage
- **Mongoose** for MongoDB modeling
- **Jest** for testing
- **Docker** for containerization
- **Winston** for structured logging

---

## Installation

### Prerequisites

- Node.js (>=14)
- Docker
- MongoDB

### Steps

1. Clone the repository:

   ```bash
   https://github.com/MuhammadSh-f/financial-backend.git
   cd financial-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

---

## Usage

### Run Locally

1. Start MongoDB locally or use Docker:

   ```bash
   docker compose up
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Access the API at `http://localhost:4000`.

---

## Environment Variables

Create a `.env` file in the root directory and set the following variables:

```plaintext
MONGO_URI=mongodb://localhost:27017/financial_instruments
PORT=4000
```

For testing, create a `.env.test` file:

```plaintext
MONGO_URI=mongodb://localhost:27017/financial_instruments_test
```

---

## API Endpoints

### 1. Health Check

- **GET** `/api/health`
- **Description**: Checks API and MongoDB status.
- **Response**:
  ```json
  {
    "status": "ok",
    "database": "connected"
  }
  ```

### 2. Get Instruments

- **GET** `/api/instruments`
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `sortBy` (e.g., `name`)
  - `order` (`asc` or `desc`)
  - `search` (filters by instrument name or symbol)
- **Response**:
  ```json
  {
    "data": [...],
    "total": 100,
    "page": 1,
    "totalPages": 10
  }
  ```

### 3. Import Data

- **POST** `/api/import`

- **Response**:
  ```json
  {
    "message": "Data imported successfully"
  }
  ```

---

## Testing

### Run Tests

1. Install Jest:

   ```bash
   npm install --save-dev jest ts-jest @types/jest
   ```

2. Run the tests:
   ```bash
   npm test
   ```

### Test Coverage

- **Unit Tests**: Test individual functions and routes.
- **Integration Tests**: Validate API behavior with the database.

---

### Using Docker

1. Build the Docker image:

   ```bash
   docker build -t financial-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 4000:4000 --env-file .env financial-backend
   ```

---

## Future Improvements

- Add authentication and authorization.
- Integrate Swagger for API documentation.
- Improve performance for large datasets.

---

## License

This project is licensed under the MIT License.
