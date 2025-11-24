# Stock Market Portfolio Tracker

A full-stack web application for tracking stock investments, visualizing portfolio performance, and managing investment transactions with real-time market data integration and comprehensive analytics.

## Project Overview

Stock Market Portfolio Tracker is a modern, production-ready web application that enables users to manage their stock investment portfolios efficiently. The application provides real-time stock price updates, comprehensive performance analytics, portfolio distribution visualization, and transaction history tracking. Built with modern technologies, it offers a responsive user experience with support for both light and dark themes.

### Key Features Implemented

**Portfolio Management**
- Add, edit, and delete stock holdings with purchase price, quantity, and date tracking
- Automatic transaction logging for all portfolio operations
- Real-time current price updates for all holdings
- Accurate profit and loss calculations with percentage analysis

**Performance Analytics**
- Portfolio performance visualization over time with historical trend analysis
- Best and worst performing stocks identification
- Comprehensive profit and loss tracking across the portfolio
- Peak and low portfolio value calculations
- Performance percentage badges and insights

**Dashboard Analytics**
- Portfolio distribution pie chart showing asset allocation
- Summary cards displaying total investment, current value, and gains/losses
- Real-time dashboard updates with refresh functionality
- Historical performance data with visual charts

**Transaction Management**
- Complete transaction history with date and time tracking
- Transaction filtering by symbol and type (BUY/SELL)
- Read-only transaction records maintaining audit trail
- Automatic transaction creation on portfolio changes

**User Experience**
- Responsive design working seamlessly on desktop, tablet, and mobile devices
- Light and dark theme toggle with persistent preferences
- Smooth animations and professional transitions
- Form validation with comprehensive error messages
- Custom date picker for transaction and purchase date entry
- Confirmation dialogs for critical operations

## Technology Stack

### Frontend Technologies
- React 18 for component-based UI development
- Vite as modern build tool with fast development server
- Tailwind CSS for responsive and utility-first styling
- React Router for client-side navigation and routing
- Zustand for lightweight state management
- Context API for theme management (light/dark mode)
- Lucide React for scalable icon library
- React Hook Form for efficient form state management
- date-fns for timezone-aware date formatting and manipulation
- React Hot Toast for non-intrusive notifications
- Recharts for interactive data visualization

### Backend Technologies
- Node.js runtime environment
- Express.js framework for REST API development
- MongoDB for NoSQL document database
- Mongoose for MongoDB object modeling and schema validation
- JWT (JSON Web Tokens) for secure authentication
- Google Oauth for secure authentication using Google via Firebase
- TwelveData API for real-time stock market data

### Database
- MongoDB for persistent data storage
- Collections: Users, Holdings, Transactions
- Indexed queries for optimal performance
- Automatic timestamp tracking on records

### External APIs
- TwelveData Stock Market API for real-time stock prices and market data

## Setup & Installation

### Option 1: Docker Setup 

Get the entire application running in seconds with all dependencies containerized!

**Requirements:**
- Docker Desktop (includes Docker & Docker Compose)
- [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

**Quick Start:**

```bash
# 1. Clone the repository
git clone https://github.com/Sahilll94/Stock-Market-Portfolio-Tracker.git
cd Stock-Market-Portfolio-Tracker

# 2. Create environment file from template
cp .env.docker .env

# 3. Edit .env with your credentials (Firebase, MongoDB Atlas URI, API keys)

# 4. Start the application
docker-compose -f docker-compose.prod.yml up -d
```

**Access the application at:** http://localhost

**For complete Docker setup guide, configuration options, and troubleshooting:**  
📖 See [DOCKER_SETUP.md](./DOCKER_SETUP.md) and [DOCKER_COMPOSE_GUIDE.md](./DOCKER_COMPOSE_GUIDE.md)

---

### Option 2: Manual Setup

### Prerequisites

System requirements:
- Node.js version 16.0 or higher installed on system
- npm (Node Package Manager) or yarn package manager
- MongoDB Atlas account or local MongoDB instance
- TwelveData API key for stock market data access
- Code editor (VS Code recommended)
- Git for version control
- Internet connection for API calls and npm packages

### Step-by-Step Installation Instructions

#### Backend Setup

1. Clone the repository to your local machine
   ```bash
   git clone https://github.com/Sahilll94/Stock-Market-Portfolio-Tracker.git
   cd Stock-Market-Portfolio-Tracker
   ```

2. Navigate to backend directory
   ```bash
   cd backend
   ```

3. Install project dependencies
   ```bash
   npm install
   ```

4. Create environment configuration file
   ```bash
   cp .env.example .env
   ```

5. Configure environment variables by editing .env file with your credentials:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
   JWT_SECRET=your-secret-key-minimum-32-characters-for-security
   JWT_EXPIRE=7d (you can decide the number of days to keep the user login)
   TWELVE_DATA_API_KEY=your-api-key-from-twelvedata
   TWELVEDATA_BASE_URL=https://api.twelvedata.com
   FRONTEND_URL=http://localhost:3000 OR your_frontend_url_for_cors
   
   # Email Configuration (Gmail) - For Password Reset OTP
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASSWORD=your_16_character_gmail_app_password
   APP_NAME=PortfolioTrack
   
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id  
   FIREBASE_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your_firebase_client_id
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com
   ```

6. Start the development server
   ```bash
   npm run dev
   ```

Backend API will be running at http://localhost:5000

#### Frontend Setup

1. In a new terminal, navigate to frontend directory
   ```bash
   cd frontend
   ```

2. Install frontend dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

Frontend application will be running at http://localhost:3000

### Environment Variables

Backend .env configuration:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
   JWT_SECRET=your-secret-key-minimum-32-characters-for-security
   JWT_EXPIRE=7d (you can decide the number of days to keep the user login)
   TWELVE_DATA_API_KEY=your-api-key-from-twelvedata
   TWELVEDATA_BASE_URL=https://api.twelvedata.com
   FRONTEND_URL=http://localhost:3000 OR your_frontend_url_for_cors
   
   # Email Configuration (Gmail) - For Password Reset OTP
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASSWORD=your_16_character_gmail_app_password
   APP_NAME=PortfolioTrack
   
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id  
   FIREBASE_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your_firebase_client_id
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com
   ```

Frontend .env configuration:
   ```
   VITE_API_URL=http://localhost:5000/api

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=tour_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebsae_app_id
   ```

### Database Setup

MongoDB Setup:
1. Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string with credentials
4. Update MONGODB_URI in backend .env file
5. Collections are created automatically by Mongoose models

Collections created:
- users: Stores user account information and authentication details
- holdings: Stores current stock positions and investment details
- transactions: Stores complete history of all buy and sell operations

### How to Run the Application

Development Mode (Both Backend and Frontend running):

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

Production Mode:

Backend:
```bash
npm run build
npm start
```

Frontend:
```bash
npm run build
npm run preview
```

## API Documentation

> You can explore and test all API endpoints using the following Postman Collection:  
> **[Postman Collection](https://www.postman.com/sahillll94/workspace/portfolio-tracker/collection/36283559-aad8529b-5ff9-4b2c-a785-533e5f464107?action=share&creator=36283559&active-environment=36283559-334dc1ba-8b38-47f4-ba47-3bebf0d78a98)**

> **Note:** Set the `base_url` to: `https://api.portfoliotrack.sahilfolio.live`


### Authentication Endpoints

Register New User
```
POST /api/auth/register
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": { "user": {...}, "token": "jwt-token" }
}
```

User Login
```
POST /api/auth/login
Request Body:
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
Response:
{
  "success": true,
  "message": "Login successful",
  "data": { "user": {...}, "token": "jwt-token" }
}
```

### Holdings Endpoints

Get All Holdings
```
GET /api/holdings
Headers: Authorization: Bearer {token}
Response:
{
  "success": true,
  "data": {
    "holdings": [
      {
        "_id": "...",
        "symbol": "AAPL",
        "purchasePrice": 150.00,
        "quantity": 10,
        "purchaseDate": "2025-01-15",
        "currentPrice": 180.00,
        "currentHoldingValue": 1800.00,
        "profitLoss": 300.00,
        "profitLossPercentage": 20.00
      }
    ],
    "summary": {
      "totalInvested": 5000.00,
      "currentValue": 6200.00,
      "totalProfitLoss": 1200.00,
      "totalProfitLossPercentage": 24.00
    }
  }
}
```

Add New Holding
```
POST /api/holdings
Headers: Authorization: Bearer {token}
Request Body:
{
  "symbol": "AAPL",
  "purchasePrice": 150.00,
  "quantity": 10,
  "purchaseDate": "2025-01-15"
}
Response:
{
  "success": true,
  "message": "Holding added successfully",
  "data": { "holding": {...} }
}
```

Update Holding
```
PUT /api/holdings/:id
Headers: Authorization: Bearer {token}
Request Body: { "quantity": 15, "purchasePrice": 155.00 }
Response: { "success": true, "message": "Holding updated successfully" }
```

Delete Holding
```
DELETE /api/holdings/:id
Headers: Authorization: Bearer {token}
Response: { "success": true, "message": "Holding deleted successfully" }
```

### Dashboard Endpoints

Get Portfolio Summary
```
GET /api/dashboard/summary
Headers: Authorization: Bearer {token}
Response:
{
  "success": true,
  "data": {
    "summary": {
      "totalInvested": 5000.00,
      "currentValue": 6200.00,
      "totalGain": 1200.00,
      "totalGainPercentage": 24.00
    }
  }
}
```

Get Portfolio Distribution
```
GET /api/dashboard/distribution
Headers: Authorization: Bearer {token}
Response:
{
  "success": true,
  "data": {
    "distribution": [
      {
        "symbol": "AAPL",
        "value": 1800.00,
        "percentage": 29.03
      }
    ]
  }
}
```

Get Performance History
```
GET /api/dashboard/performance/:days
Headers: Authorization: Bearer {token}
Response:
{
  "success": true,
  "data": {
    "performance": [
      {
        "date": "2025-01-15",
        "totalInvested": 5000.00,
        "totalValue": 5100.00
      }
    ]
  }
}
```

### Transactions Endpoints

Get All Transactions
```
GET /api/transactions
Headers: Authorization: Bearer {token}
Query Parameters: symbol=AAPL&type=BUY
Response:
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "...",
        "symbol": "AAPL",
        "type": "BUY",
        "quantity": 10,
        "pricePerShare": 150.00,
        "totalValue": 1500.00,
        "date": "2025-01-15T14:30:00Z"
      }
    ]
  }
}
```

Get Transaction by ID
```
GET /api/transactions/:id
Headers: Authorization: Bearer {token}
Response: { "success": true, "data": { "transaction": {...} } }
```

Authentication Requirements

All API endpoints except registration and login require JWT token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Live Demo

The application is deployed and available at the following URLs:

> **Frontend (User Interface):** https://portfoliotrack.sahilfolio.live/

> **Backend API:** https://api.portfoliotrack.sahilfolio.live/

**Test Credentials for Review:**
```
Email: testaccount@gmail.com
Password: testaccount
```


## Screenshots

**Dashboard Page**
![Dashboard Page](/frontend/public/dashboard-page-image.png)
Shows portfolio summary with distribution chart, performance overview, and key metrics.

**Holdings Management**
![Holdings Management](/frontend/public/holdings-management-page.png)
Displays list of holdings with purchase price, quantity, current value, and profit/loss tracking.

**Transactions History**
![Transactions History](/frontend/public/transaction-history.png)
Complete transaction history with date, time, type (BUY/SELL), and filtering options.

**Portfolio Performance**

![Portfolio Performance](/frontend/public/portfolio-performance.png)

Visual representation of portfolio performance over time with trend analysis.

## Known Issues and Limitations

### Current Limitations
- Stock price data updates are dependent on TwelveData API availability
- Real-time price updates have a frequency limit based on API quota
- Mobile date picker may have limited functionality on certain browsers
- Portfolio calculations are based on historical transaction records

### Future Improvements
- Add watchlist feature to track stocks without owning them
- Multi-currency support for international stock market transactions
- Advanced charting with candlestick patterns and technical analysis tools
- Mobile application development for Android platforms
- Machine learning based portfolio recommendations and risk analysis

## Assumptions Made

### Technical Assumptions
- TwelveData API will maintain consistent availability and response times
- Users will have basic knowledge of stock market terminology and portfolio management
- Stock purchases are assumed to be in a single currency (INR) without forex conversion
- All transactions are assumed to be complete market orders without pending or partial fills
- Historical price data required for performance charts will be available from API
- Each user manages only one portfolio without multi-portfolio support

### Business Assumptions
- Users will update holdings information within a reasonable timeframe of actual purchases
- Portfolio performance calculations are based on accurate purchase prices and quantities
- Transaction history is treated as immutable and complete audit trail
- All holdings belong to a single user account without family or group portfolio sharing
- Users understand that past performance does not guarantee future returns
- Application serves as informational tool and not as financial advice

## Video Walkthrough

A comprehensive video walkthrough demonstrating the application features and technical implementation is available at:

[YouTube Link - Video will be uploaded and link added here]

The video walkthrough (3-5 minutes) includes:
- Application overview and key features
- User registration and login process
- Portfolio management workflows
- Dashboard analytics and visualization
- Transaction history and filtering
- Theme toggle and responsive design
- Technical architecture explanation

## Development and Deployment

The application is built using modern web development practices and follows industry standards for security and performance optimization.

### Local Development
Full setup with development servers running on localhost provides hot module reloading and instant feedback during development.

### Production Deployment
Both frontend and backend are deployed on production servers with optimized builds, environment variables, and security configurations.

### CI/CD Pipeline
Version control through GitHub with continuous integration and deployment workflows for automated testing and deployment.

## Support and Contact

For technical inquiries or issues, please refer to the detailed code documentation in backend and frontend directories.

---

**Latest Update:** November 2025 | 21:16
**Version:** 1.0.3
**Repository:** https://github.com/Sahilll94/Stock-Market-Portfolio-Tracker
