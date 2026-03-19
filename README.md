# Dashboard API

A RESTful API for dashboard charts built with Node.js, TypeScript, Express, Prisma ORM, and MySQL.

## Features

- **Dynamic Chart Endpoints**: Get chart data for pie, line, bar charts and more
- **Date Filtering**: All endpoints require start and end date parameters for data filtering
- **Multiple Grouping Options**: Group data by category, product, date, week, or month
- **Dashboard Summary**: Get key metrics at a glance
- **TypeScript**: Full type safety
- **Prisma ORM**: Type-safe database access
- **Comprehensive Tests**: Unit and integration tests included

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: MySQL
- **Validation**: Zod
- **Testing**: Jest, Supertest

## Prerequisites

- Node.js >= 18.x
- MySQL >= 8.0
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/dashboard_db"
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   
   Create the database in MySQL:
   ```sql
   CREATE DATABASE dashboard_db;
   ```

5. **Run Prisma migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

7. **Seed the database (optional)**
   ```bash
   npm run prisma:seed
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api/charts
```

### Endpoints

#### 1. Get Dynamic Chart Data
```
GET /api/charts/:chartType
```

**Parameters:**
- `chartType` (path): Type of chart (`pie`, `line`, `bar`, `summary`, `trend`)

**Query Parameters:**
| Parameter | Required | Format | Description |
|-----------|----------|--------|-------------|
| startDate | Yes | YYYY-MM-DD | Start date for filtering |
| endDate | Yes | YYYY-MM-DD | End date for filtering |
| groupBy | No | string | Grouping field (varies by chart type) |

**Example:**
```bash
curl "http://localhost:3000/api/charts/pie?startDate=2024-01-01&endDate=2024-12-31"
```

**Response:**
```json
{
  "success": true,
  "chartType": "pie",
  "filter": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.999Z"
  },
  "data": [
    { "label": "Electronics", "value": 15000 },
    { "label": "Clothing", "value": 8000 },
    { "label": "Home", "value": 5000 }
  ]
}
```

---

#### 2. Get Pie Chart Data
```
GET /api/charts/pie
```

**Query Parameters:**
| Parameter | Required | Default | Options |
|-----------|----------|---------|---------|
| startDate | Yes | - | - |
| endDate | Yes | - | - |
| groupBy | No | category | category, product |

**Example:**
```bash
curl "http://localhost:3000/api/charts/pie?startDate=2024-01-01&endDate=2024-12-31&groupBy=product"
```

---

#### 3. Get Line Chart Data
```
GET /api/charts/line
```

**Query Parameters:**
| Parameter | Required | Default | Options |
|-----------|----------|---------|---------|
| startDate | Yes | - | - |
| endDate | Yes | - | - |
| groupBy | No | date | date, week, month |

**Example:**
```bash
curl "http://localhost:3000/api/charts/line?startDate=2024-01-01&endDate=2024-12-31&groupBy=month"
```

**Response:**
```json
{
  "success": true,
  "chartType": "line",
  "filter": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.999Z"
  },
  "data": [
    { "date": "2024-01", "value": 5000 },
    { "date": "2024-02", "value": 7500 },
    { "date": "2024-03", "value": 6200 }
  ]
}
```

---

#### 4. Get Bar Chart Data
```
GET /api/charts/bar
```

**Query Parameters:**
| Parameter | Required | Default | Options |
|-----------|----------|---------|---------|
| startDate | Yes | - | - |
| endDate | Yes | - | - |
| groupBy | No | category | category, product |

**Example:**
```bash
curl "http://localhost:3000/api/charts/bar?startDate=2024-01-01&endDate=2024-12-31"
```

---

#### 5. Get Dashboard Summary
```
GET /api/charts/summary
```

**Query Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| startDate | Yes | Start date for filtering |
| endDate | Yes | End date for filtering |

**Example:**
```bash
curl "http://localhost:3000/api/charts/summary?startDate=2024-01-01&endDate=2024-12-31"
```

**Response:**
```json
{
  "success": true,
  "chartType": "summary",
  "filter": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.999Z"
  },
  "data": {
    "totalSales": 500,
    "totalRevenue": 75000,
    "averageOrderValue": 150,
    "totalOrders": 500
  }
}
```

---

### Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (missing/invalid parameters) |
| 404 | Endpoint not found |
| 500 | Internal Server Error |

### API Documentation Endpoint
```
GET /api/docs
```

Returns comprehensive API documentation in JSON format.

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Test Structure
- **Unit Tests**: `tests/unit/`
  - Validators
  - Services
- **Integration Tests**: `tests/integration/`
  - API endpoints

## Project Structure

```
dashboard-api/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed data script
│   └── migrations/        # Database migrations
├── src/
│   ├── config/            # Configuration files
│   │   └── database.ts    # Prisma client instance
│   ├── controllers/       # Request handlers
│   │   └── chart.controller.ts
│   ├── middlewares/       # Express middlewares
│   │   └── dateFilter.middleware.ts
│   ├── repositories/      # Data access layer
│   │   └── chart.repository.ts
│   ├── routes/            # API routes
│   │   └── chart.routes.ts
│   ├── services/          # Business logic
│   │   └── chart.service.ts
│   ├── validators/        # Input validation
│   │   └── chart.validator.ts
│   └── index.ts           # Application entry point
├── tests/
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── setup.ts           # Test configuration
├── .env                   # Environment variables
├── .env.example           # Example environment file
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Database Schema

### Sale Model
```prisma
model Sale {
  id          Int      @id @default(autoincrement())
  productId   Int
  product     String
  category    String
  amount      Float
  quantity    Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed the database |
| `npm run prisma:studio` | Open Prisma Studio |

## License

ISC

## Author

Dashboard API - RESTful API for Dashboard Charts
