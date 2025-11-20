# Stock Portfolio Tracker - Backend

A Node.js and Express.js backend for a stock portfolio tracker application. This API allows users to manage their stock holdings, track transactions, and view portfolio analytics.

> This project uses US stock symbols (AAPL, MSFT, GOOGL, etc.) because TwelveData free plan does not include NSE/BSE. The logic and portfolio management works the same for Indian stocks.

## Features

- **User Authentication**: Register, login, and profile management with JWT
- **Portfolio Management**: Add, view, update, and delete stock holdings
- **Real-time Stock Prices**: Integration with TwelveData API for current stock prices
- **Profit/Loss Calculation**: Automatic P&L calculation for each holding
- **Transaction History**: Complete audit trail of all buy/sell transactions
- **Dashboard Analytics**: Portfolio summary, best/worst performers, and distribution charts
- **Price Caching**: Optimized API calls with intelligent caching

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Axios**: HTTP client for API requests
- **TwelveData API**: Real-time stock price data

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js           # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── holdingController.js  # Portfolio management
│   │   ├── transactionController.js  # Transaction history
│   │   └── dashboardController.js    # Analytics & summary
│   ├── middleware/
│   │   ├── protect.js            # JWT verification
│   │   ├── errorHandler.js       # Global error handler
│   │   └── validateInput.js      # Input validation
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Holding.js            # Stock holding schema
│   │   ├── Transaction.js        # Transaction schema
│   │   └── PriceCache.js         # Price cache schema
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── holdingRoutes.js      # Portfolio routes
│   │   ├── transactionRoutes.js  # Transaction routes
│   │   └── dashboardRoutes.js    # Dashboard routes
│   ├── services/
│   │   └── StockPriceService.js  # Stock price fetching
│   └── utils/
│       ├── AppError.js           # Custom error class
│       ├── auth.js               # JWT utilities
│       └── catchAsync.js         # Async error wrapper
├── server.js                     # Application entry point
├── package.json                  # Dependencies
├── .env.example                  # Environment variables template
└── .gitignore                    # Git ignore rules
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (Atlas or local)
- TwelveData API key (sign up at https://twelvedata.com)

## Installation

1. **Clone the repository** (or extract the files)

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the backend directory and copy from `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your actual values:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/stock-tracker?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
TWELVEDATA_API_KEY=your_twelvedata_api_key_here
TWELVEDATA_BASE_URL=https://api.twelvedata.com
FRONTEND_URL=http://localhost:3000
```

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

This requires `nodemon` to be installed (already in devDependencies).

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| GET | `/api/auth/logout` | User logout | No |
| PUT | `/api/auth/update-profile` | Update user profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Holdings (Portfolio Management)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/holdings` | Add new holding | Yes |
| GET | `/api/holdings` | Get all holdings with P&L | Yes |
| GET | `/api/holdings/:id` | Get single holding | Yes |
| PUT | `/api/holdings/:id` | Update holding | Yes |
| DELETE | `/api/holdings/:id` | Delete holding | Yes |

### Transactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/transactions` | Get all transactions | Yes |
| GET | `/api/transactions/:id` | Get single transaction | Yes |
| GET | `/api/transactions/summary` | Get transaction statistics | Yes |

### Dashboard & Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/dashboard/summary` | Get portfolio summary | Yes |
| GET | `/api/dashboard/distribution` | Get portfolio distribution | Yes |
| GET | `/api/dashboard/performance` | Get portfolio performance | Yes |

## API Examples

### Register User

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Login User

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Add Holding

**Request:**
```bash
POST /api/holdings
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "AAPL",
  "purchasePrice": 2500,
  "quantity": 10,
  "purchaseDate": "2024-01-10"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Holding added successfully",
  "data": {
    "holding": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "symbol": "AAPL",
      "purchasePrice": 2500,
      "quantity": 10,
      "purchaseDate": "2024-01-10T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Get All Holdings with P&L

**Request:**
```bash
GET /api/holdings
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "holdings": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "userId": "507f1f77bcf86cd799439011",
        "symbol": "AAPL",
        "purchasePrice": 2500,
        "quantity": 10,
        "purchaseDate": "2024-01-10T00:00:00Z",
        "currentPrice": 2750,
        "investedAmount": 25000,
        "currentHoldingValue": 27500,
        "profitLoss": 2500,
        "profitLossPercentage": 10.0,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "summary": {
      "totalInvested": 25000,
      "currentValue": 27500,
      "totalProfitLoss": 2500,
      "totalProfitLossPercentage": 10.0,
      "numberOfHoldings": 1
    }
  }
}
```

### Get Dashboard Summary

**Request:**
```bash
GET /api/dashboard/summary
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalInvested": 75000,
      "currentPortfolioValue": 82500,
      "totalProfitLoss": 7500,
      "totalProfitLossPercentage": 10.0,
      "numberOfHoldings": 3
    },
    "bestPerformer": {
      "symbol": "TSLA",
      "profitLossPercentage": 15.5,
      "profitLoss": 3100
    },
    "worstPerformer": {
      "symbol": "NVDA",
      "profitLossPercentage": -5.2,
      "profitLoss": -1040
    },
    "topHoldings": [
      {
        "symbol": "AAPL",
        "currentPrice": 2750,
        "quantity": 10,
        "investedAmount": 25000,
        "currentHoldingValue": 27500,
        "profitLoss": 2500,
        "profitLossPercentage": 10.0,
        "percentageOfPortfolio": 33.33
      }
    ]
  }
}
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```bash
Authorization: Bearer <your_jwt_token>
```

The token is valid for 7 days by default and can be configured in the `.env` file.

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (authentication required)
- **404**: Not Found
- **500**: Internal Server Error

## Database Schema

### User
- `_id`: ObjectId (Primary Key)
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `createdAt`: Date
- `updatedAt`: Date

### Holding
- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (Foreign Key -> User)
- `symbol`: String (Stock symbol)
- `purchasePrice`: Number
- `quantity`: Number
- `purchaseDate`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Transaction
- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (Foreign Key -> User)
- `symbol`: String
- `type`: String (Enum: "BUY", "SELL")
- `quantity`: Number
- `pricePerShare`: Number
- `totalValue`: Number
- `date`: Date

### PriceCache
- `symbol`: String (Unique)
- `price`: Number
- `updatedAt`: Date (Auto-expires after 1 hour)

## Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs with salt rounds of 10
2. **JWT Authentication**: Secure token-based authentication
3. **CORS**: Cross-origin requests controlled
4. **Helmet**: HTTP headers security
5. **Input Validation**: Server-side validation on all inputs
6. **Data Isolation**: Each user can only access their own data
7. **Environment Variables**: Sensitive configuration stored securely

## Performance Optimizations

1. **Price Caching**: Stock prices are cached for 1 hour to reduce API calls
2. **Database Indexes**: Indexes on frequently queried fields (userId, symbol, date)
3. **Selective Queries**: Only fetch required fields
4. **Batch API Calls**: Multiple stock prices fetched in one request where possible

## Known Limitations & Future Improvements

1. **Stock Price Updates**: Currently fetches prices on-demand. Could implement WebSockets for real-time updates
2. **Dividend Tracking**: Does not currently track dividend payments
3. **Tax Calculations**: No built-in tax calculation features
4. **Multiple Currencies**: Currently assumes INR only
5. **Rate Limiting**: Could implement rate limiting for API endpoints
6. **Testing**: Add comprehensive unit and integration tests

## Deployment

To deploy to production (e.g., Vercel, Heroku, Railway):

1. Set environment variables in the hosting platform
2. Ensure MongoDB Atlas connection string is correct
3. Change `JWT_SECRET` to a strong, random value
4. Set `NODE_ENV=production`
5. Update `FRONTEND_URL` to match your frontend domain

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB URI in `.env`
- Check firewall/whitelist settings in MongoDB Atlas
- Ensure connection string includes correct username and password

### API Key Errors (TwelveData)
- Verify `TWELVEDATA_API_KEY` is correct
- Check API key has sufficient quota
- Ensure stock symbol is valid (e.g., AAPL, GOOGL, META)

### CORS Errors
- Update `FRONTEND_URL` in `.env` to match your frontend domain
- Ensure frontend sends proper `Authorization` headers