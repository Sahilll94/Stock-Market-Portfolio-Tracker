# Stock Portfolio Tracker - Backend API

A robust Node.js and Express.js REST API for a comprehensive stock portfolio management application. This backend handles user authentication, portfolio management, real-time stock prices, transaction tracking, and advanced portfolio analytics.

> This project uses US stock symbols (AAPL, MSFT, GOOGL, etc.) from TwelveData API. The logic and portfolio management works identically for any stock symbol available on the API.

## Overview

**API Base URL**: `https://api.portfoliotrack.sahilfolio.live`

The backend provides:
- 🔐 JWT-based authentication with email/password and Google OAuth
- 📈 Real-time stock price integration with TwelveData API
- 💼 Complete portfolio management (add, edit, delete holdings)
- 📊 Advanced analytics and dashboard metrics
- 📝 Complete transaction audit trail
- ⚡ Intelligent price caching to optimize API usage
- 🛡️ Security best practices (password hashing, input validation, rate limiting)

## Features

### Authentication & Security
- **User Registration** - Email/password signup with validation
- **User Login** - Secure login with remember me functionality
- **Google OAuth** - One-click Google Sign-In integration
- **JWT Authentication** - Token-based authentication (7-day expiry)
- **Password Hashing** - bcryptjs with 10 salt rounds
- **Session Management** - Automatic token refresh
- **Profile Management** - Update user information
- **Password Reset** - Email-based password recovery with OTP
- **Protected Routes** - All data endpoints require authentication
- **User Data Isolation** - Each user can only access their own data

### Portfolio Management
- **Add Holdings** - Add new stock holdings with purchase details
- **View Holdings** - Get all holdings with real-time P&L calculations
- **Update Holdings** - Modify quantity and purchase price
- **Delete Holdings** - Remove holdings (creates SELL transaction)
- **Real-time Prices** - Fetch current prices from TwelveData API
- **P&L Calculations** - Automatic profit/loss in ₹ and %
- **Portfolio Summary** - Total invested, current value, overall gain/loss
- **Holdings Filtering** - Filter by symbol or search functionality

### Transaction History
- **Transaction Recording** - Automatic BUY/SELL transaction creation
- **Complete Audit Trail** - Immutable transaction history
- **Transaction Filtering** - Filter by symbol, type, date, amount
- **Transaction Summary** - Total bought, sold, net investment
- **Per-Symbol Statistics** - Individual stock transaction summary
- **Export Transactions** - Download transaction history

### Dashboard & Analytics
- **Portfolio Summary** - Key metrics at a glance
- **Performance Tracking** - Portfolio value over time
- **Portfolio Distribution** - Asset allocation by percentage
- **Best/Worst Performers** - Top 3 gainers and losers
- **Custom Date Ranges** - Filter performance by time periods
- **Real-time Updates** - Data refreshed on each request
- **Top Holdings** - Display largest positions

### Stock Price Integration
- **Real-time Prices** - Live price fetching from TwelveData
- **Smart Caching** - 2-minute cache to optimize API usage
- **Rate Limiting** - Request throttling to avoid rate limits
- **Fallback Pricing** - Uses cached prices if API fails
- **Multiple Stock Symbols** - Batch price fetching
- **Error Handling** - Graceful degradation on API failures

## Tech Stack

- **Node.js** - JavaScript runtime (v16+)
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and comparison
- **Axios** - HTTP client for API requests
- **Dotenv** - Environment variable management
- **Cors** - Cross-origin resource sharing
- **Helmet** - HTTP security headers
- **Morgan** - HTTP request logging
- **Nodemon** - Development server with auto-reload
- **TwelveData API** - Real-time stock price data

## Dev Dependencies

- **ESLint** - Code quality and style checking
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart on file changes

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

## Installation & Setup

### Prerequisites
- **Node.js** v16 or higher (`node --version`)
- **npm** v8 or higher (`npm --version`)
- **MongoDB** - Atlas (cloud) or local installation
- **TwelveData API Key** - Free tier from https://twelvedata.com
- **Gmail Account** - For email service (optional, for password reset)
- **Firebase Project** - For Google OAuth (optional)

### Step 1: Clone & Navigate
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all dependencies from `package.json` including:
- Express.js, Mongoose, JWT, bcryptjs
- Development tools (nodemon, ESLint, Prettier)

### Step 3: Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` and update with your actual values:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolioDB?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_at_least_32_chars
JWT_EXPIRE=7d

# Stock Price API (TwelveData)
TWELVEDATA_API_KEY=your_twelvedata_api_key_here
TWELVEDATA_BASE_URL=https://api.twelvedata.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Firebase Configuration (for Google OAuth)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_firebase_client_id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs

# Email Service (for password reset)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_specific_password
APP_NAME=PortfolioTrack
```

### Step 4: Get Required API Keys

**TwelveData API Key** (Free)
1. Go to https://twelvedata.com
2. Sign up for free account
3. Get your API key from dashboard
4. Add to `.env` as `TWELVEDATA_API_KEY`

**Firebase Setup** (for Google OAuth)
1. Go to https://console.firebase.google.com
2. Create new project
3. Download service account key as JSON
4. Copy values to `.env`

**Gmail Setup** (for email service)
1. Enable 2-Factor Authentication on Gmail
2. Generate app-specific password
3. Use that password in `EMAIL_PASSWORD`

### Step 5: Start the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

Server starts on: `http://localhost:5000`

### Verify Installation
```bash
# Test API health
curl http://localhost:5000/api/health

# Expected response:
# {"status": "OK", "message": "Server is running"}
```

## API Documentation

### Base URL
```
https://api.portfoliotrack.sahilfolio.live/api
```

### Request Headers
All requests should include:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>  (for protected endpoints)
```

### Response Format
All responses follow a standard format:
```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Authentication Endpoints

#### POST `/auth/register` - Register New User
Register a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-11-25T10:30:00Z",
      "updatedAt": "2024-11-25T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/auth/login` - User Login
Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET `/auth/me` - Get Current User
Requires authentication.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-11-25T10:30:00Z",
      "updatedAt": "2024-11-25T10:30:00Z"
    }
  }
}
```

#### PUT `/auth/update-profile` - Update Profile
Update user information. Requires authentication.

**Request:**
```json
{
  "name": "Jane Doe"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Jane Doe",
      "email": "john@example.com"
    }
  }
}
```

#### PUT `/auth/change-password` - Change Password
Change user password. Requires authentication.

**Request:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Holdings Endpoints

#### POST `/holdings` - Add New Holding
Add a new stock holding to portfolio.

**Request:**
```json
{
  "symbol": "AAPL",
  "purchasePrice": 150,
  "quantity": 10,
  "purchaseDate": "2024-11-20"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Holding added successfully",
  "data": {
    "holding": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "symbol": "AAPL",
      "purchasePrice": 150,
      "quantity": 10,
      "purchaseDate": "2024-11-20T00:00:00Z",
      "createdAt": "2024-11-25T10:30:00Z",
      "updatedAt": "2024-11-25T10:30:00Z"
    }
  }
}
```

#### GET `/holdings` - Get All Holdings
Get all holdings with real-time prices and P&L calculations.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "holdings": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "symbol": "AAPL",
        "purchasePrice": 150,
        "quantity": 10,
        "currentPrice": 169,
        "investedAmount": 1500,
        "currentHoldingValue": 1690,
        "profitLoss": 190,
        "profitLossPercentage": 12.67,
        "purchaseDate": "2024-11-20T00:00:00Z"
      }
    ],
    "summary": {
      "totalInvested": 1500,
      "currentValue": 1690,
      "totalProfitLoss": 190,
      "totalProfitLossPercentage": 12.67,
      "numberOfHoldings": 1
    }
  }
}
```

#### GET `/holdings/:id` - Get Single Holding
Get detailed information about one holding.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "holding": {
      "_id": "507f1f77bcf86cd799439012",
      "symbol": "AAPL",
      "purchasePrice": 150,
      "quantity": 10,
      "currentPrice": 169,
      "investedAmount": 1500,
      "currentHoldingValue": 1690,
      "profitLoss": 190,
      "profitLossPercentage": 12.67
    }
  }
}
```

#### PUT `/holdings/:id` - Update Holding
Update quantity or purchase price of a holding.

**Request:**
```json
{
  "quantity": 15,
  "purchasePrice": 150
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Holding updated successfully",
  "data": {
    "holding": {
      "_id": "507f1f77bcf86cd799439012",
      "symbol": "AAPL",
      "quantity": 15,
      "purchasePrice": 150
    }
  }
}
```

#### DELETE `/holdings/:id` - Delete Holding
Delete a holding (creates automatic SELL transaction at current price).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Holding deleted successfully"
}
```

### Transactions Endpoints

#### GET `/transactions` - Get All Transactions
Get all transactions with optional filtering.

**Query Parameters:**
- `symbol` - Filter by stock symbol (optional)
- `type` - Filter by BUY/SELL (optional)
- `sortBy` - Sort field (optional)
- `page` - Pagination (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "symbol": "AAPL",
        "type": "BUY",
        "quantity": 10,
        "pricePerShare": 150,
        "totalValue": 1500,
        "date": "2024-11-20T00:00:00Z"
      }
    ]
  }
}
```

#### GET `/transactions/:id` - Get Single Transaction
Get detailed information about one transaction.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "_id": "507f1f77bcf86cd799439013",
      "symbol": "AAPL",
      "type": "BUY",
      "quantity": 10,
      "pricePerShare": 150,
      "totalValue": 1500,
      "date": "2024-11-20T00:00:00Z"
    }
  }
}
```

#### GET `/transactions/summary` - Get Transaction Summary
Get aggregated transaction statistics.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBought": 5000,
      "totalSold": 1000,
      "netInvestment": 4000,
      "transactionCount": 5,
      "perSymbol": {
        "AAPL": {
          "totalBought": 3000,
          "totalSold": 500,
          "netQuantity": 15
        }
      }
    }
  }
}
```

### Dashboard Endpoints

#### GET `/dashboard/summary` - Portfolio Summary
Get portfolio overview with best/worst performers.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalInvested": 5000,
      "currentPortfolioValue": 5500,
      "totalProfitLoss": 500,
      "totalProfitLossPercentage": 10.0,
      "numberOfHoldings": 2
    },
    "bestPerformer": {
      "symbol": "AAPL",
      "profitLossPercentage": 12.67,
      "profitLoss": 190
    },
    "worstPerformer": {
      "symbol": "GOOGL",
      "profitLossPercentage": 5.0,
      "profitLoss": 100
    },
    "topHoldings": [...]
  }
}
```

#### GET `/dashboard/distribution` - Portfolio Distribution
Get asset allocation data.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "distribution": [
      {
        "symbol": "AAPL",
        "value": 1690,
        "percentage": 30.91
      },
      {
        "symbol": "GOOGL",
        "value": 2100,
        "percentage": 38.18
      }
    ]
  }
}
```

#### GET `/dashboard/performance` - Portfolio Performance
Get historical portfolio performance data.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "performance": [
      {
        "date": "2024-11-20",
        "value": 5000,
        "profitLoss": 0
      },
      {
        "date": "2024-11-25",
        "value": 5500,
        "profitLoss": 500
      }
    ]
  }
}
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,           // Primary key
  name: String,            // User full name
  email: String,           // Email (unique)
  password: String,        // Hashed password
  profilePicture: String,  // URL or base64
  createdAt: Date,         // Account creation time
  updatedAt: Date          // Last update time
}
```

### Holding Model
```javascript
{
  _id: ObjectId,           // Primary key
  userId: ObjectId,        // Foreign key → User
  symbol: String,          // Stock symbol (AAPL, GOOGL, etc)
  purchasePrice: Number,   // Purchase price per share
  quantity: Number,        // Number of shares
  purchaseDate: Date,      // When purchased
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  _id: ObjectId,           // Primary key
  userId: ObjectId,        // Foreign key → User
  symbol: String,          // Stock symbol
  type: String,            // "BUY" or "SELL"
  quantity: Number,        // Number of shares
  pricePerShare: Number,   // Price per share
  totalValue: Number,      // quantity × pricePerShare
  date: Date,              // Transaction date
  createdAt: Date,
  updatedAt: Date
}
```

### PriceCache Model
```javascript
{
  symbol: String,          // Stock symbol (unique)
  price: Number,           // Current price
  updatedAt: Date          // Last fetched time
}
```

## Security Features

### ✅ Authentication & Authorization
- **JWT Tokens** - Stateless authentication with 7-day expiry
- **Password Hashing** - bcryptjs with 10 salt rounds
- **Protected Routes** - All sensitive endpoints require authentication
- **User Isolation** - Each user can only access their own data
- **Token Validation** - Verified on every protected request

### ✅ Input Validation
- **Email Validation** - Standard email format checking
- **Password Requirements** - Minimum length and complexity
- **Stock Symbol Validation** - Uppercase conversion and format checks
- **Numeric Validation** - Price and quantity constraints
- **Required Fields** - Mandatory field enforcement

### ✅ Security Headers
- **Helmet.js** - Sets security-related HTTP headers
- **CORS** - Controlled cross-origin requests
- **Rate Limiting** - Prevents API abuse (API request throttling)
- **HTTPS** - All production traffic encrypted

### ✅ Data Protection
- **Password Encryption** - Never store plaintext passwords
- **JWT Secret** - Strong, random secret key (min 32 chars)
- **Environment Variables** - Sensitive data in .env, not in code
- **MongoDB Indexes** - Optimized queries reduce exposure time

### ✅ Best Practices
- **Error Messages** - Generic messages hide implementation details
- **Request Logging** - Morgan logs for audit trail
- **SQL/NoSQL Injection** - Mongoose prevents injection
- **XSS Protection** - JSON responses not HTML

## Performance & Optimization

### ✅ Price Caching Strategy
- **2-Minute Cache** - Reduces API calls significantly
- **In-Memory + DB Cache** - Fast retrieval with persistence
- **Smart Throttling** - 1-second delay between API requests
- **Rate Limit Handling** - Graceful degradation on API limit
- **Fallback Pricing** - Uses cached price if API fails

### ✅ Database Optimization
- **Mongoose Indexing** - Fast queries on userId, symbol, date
- **Selective Fields** - Only fetch required fields
- **Query Optimization** - Lean queries where possible
- **Connection Pooling** - MongoDB connection reuse

### ✅ API Optimization
- **Async/Await** - Non-blocking operations
- **Parallel Requests** - Concurrent batch price fetching
- **Response Compression** - Gzip compression enabled
- **JSON Serialization** - Efficient data transfer

### ✅ Code Quality
- **Error Handling** - Graceful error recovery
- **Logging** - Morgan HTTP logging
- **Async Wrapper** - Centralized error catching
- **Custom Middleware** - Reusable middleware components

### Planned Features
- [ ] **WebSocket Support** - Real-time price updates via WebSockets
- [ ] **Dividend Tracking** - Record and track dividend income
- [ ] **Tax Reports** - Generate capital gains reports
- [ ] **Advanced Analytics** - Risk metrics, Sharpe ratio, etc.
- [ ] **Multiple Currencies** - Support for different currencies
- [ ] **Portfolio Alerts** - Price and portfolio change alerts
- [ ] **Backup/Export** - Portfolio export to CSV/JSON
- [ ] **API Rate Limiting** - Protect against abuse
- [ ] **Webhook Support** - Webhooks for external integrations
- [ ] **Batch Imports** - Bulk import transactions

### Performance Improvements (Future)
- Implement Redis caching for distributed systems
- Add GraphQL API as alternative to REST
- Implement request batching for frontend
- Add API versioning for smooth transitions

## Deployment

### Prerequisites
- Node.js v16+ installed
- MongoDB Atlas account (cloud) or self-hosted MongoDB
- TwelveData API key
- Gmail account (for email service)
- Firebase project (for Google OAuth)

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Create Vercel Project**
   - Go to https://vercel.com
   - Click "New Project"
   - Select GitHub repository
   - Import the project

3. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add all `.env` variables from your local setup
   - Critical variables:
     - MONGODB_URI
     - JWT_SECRET
     - TWELVEDATA_API_KEY
     - FIREBASE_* variables
     - EMAIL_*  variables

4. **Deploy**
   - Vercel auto-detects Node.js
   - Builds and deploys automatically

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Change `JWT_SECRET` to strong random value (32+ chars)
- [ ] Use strong MongoDB password
- [ ] Enable HTTPS/SSL
- [ ] Setup environment variables in hosting platform
- [ ] Test all API endpoints in production
- [ ] Monitor server logs and errors
- [ ] Configure CORS for production domain
- [ ] Enable API rate limiting
- [ ] Setup database backups
- [ ] Configure monitoring and alerts