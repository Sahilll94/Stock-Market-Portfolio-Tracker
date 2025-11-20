# Stock Portfolio Tracker API - Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints marked with require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": { _id, name, email, createdAt, updatedAt }
  }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": { _id, name, email, createdAt, updatedAt }
  }
}
```

### Get Current User 
```
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { _id, name, email, createdAt, updatedAt }
  }
}
```

### Update Profile 
```
PUT /auth/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Response: 200 OK
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { ... }
  }
}
```

### Change Password 
```
PUT /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}

Response: 200 OK
{
  "success": true,
  "token": "new_jwt_token",
  "data": {
    "user": { ... }
  }
}
```

### Logout
```
GET /auth/logout

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Holdings Endpoints (Portfolio Management)

### Add New Holding 
```
POST /holdings
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "AAPL",
  "purchasePrice": 150,
  "quantity": 10,
  "purchaseDate": "2024-01-10"
}

Response: 201 Created
{
  "success": true,
  "message": "Holding added successfully",
  "data": {
    "holding": {
      "_id": "...",
      "userId": "...",
      "symbol": "RELIANCE",
      "purchasePrice": 2500,
      "quantity": 10,
      "purchaseDate": "2024-01-10",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

### Get All Holdings with P&L 
```
GET /holdings
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "holdings": [
      {
        "_id": "...",
        "symbol": "AAPL",
        "purchasePrice": 150,
        "quantity": 10,
        "currentPrice": 165,
        "investedAmount": 1500,
        "currentHoldingValue": 1650,
        "profitLoss": 150,
        "profitLossPercentage": 10.0,
        ...
      },
      ...
    ],
    "summary": {
      "totalInvested": 75000,
      "currentValue": 82500,
      "totalProfitLoss": 7500,
      "totalProfitLossPercentage": 10.0,
      "numberOfHoldings": 3
    }
  }
}
```

### Get Single Holding 
```
GET /holdings/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "holding": {
      "_id": "...",
      "symbol": "AAPL",
      "currentPrice": 165,
      "investedAmount": 1500,
      "currentHoldingValue": 1650,
      "profitLoss": 150,
      "profitLossPercentage": 10.0,
      ...
    }
  }
}
```

### Update Holding 
```
PUT /holdings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "purchasePrice": 2600,
  "quantity": 15,
  "purchaseDate": "2024-01-10"
}

Response: 200 OK
{
  "success": true,
  "message": "Holding updated successfully",
  "data": {
    "holding": { ... }
  }
}
```

### Delete Holding 
```
DELETE /holdings/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Holding deleted successfully"
}
```

---

## Transaction Endpoints

### Get All Transactions 
```
GET /transactions?symbol=AAPL&type=BUY&sortBy=date
Authorization: Bearer <token>

Query Parameters:
- symbol: Optional, filter by stock symbol
- type: Optional, filter by type (BUY or SELL)
- sortBy: Optional, sort by (date, symbol, type) - default: date

Response: 200 OK
{
  "success": true,
  "count": 5,
  "data": {
    "transactions": [
      {
        "_id": "...",
        "symbol": "AAPL",
        "type": "BUY",
        "quantity": 10,
        "pricePerShare": 150,
        "totalValue": 1500,
        "date": "2024-01-10"
      },
      ...
    ]
  }
}
```

### Get Single Transaction 
```
GET /transactions/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "transaction": { ... }
  }
}
```

### Get Transaction Summary 
```
GET /transactions/summary
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "summary": {
      "totalTransactions": 10,
      "buyTransactions": 7,
      "sellTransactions": 3,
      "totalBought": 75000,
      "totalSold": 15000,
      "netInvestment": 60000
    },
    "symbolStats": [
      {
        "symbol": "RELIANCE",
        "buyCount": 2,
        "sellCount": 0,
        "totalBought": 50000,
        "totalSold": 0,
        "netQuantity": 20
      },
      ...
    ]
  }
}
```

---

## Dashboard Endpoints

### Get Portfolio Summary 
```
GET /dashboard/summary
Authorization: Bearer <token>

Response: 200 OK
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
      "symbol": "AAPL",
      "profitLossPercentage": 15.5,
      "profitLoss": 310
    },
    "worstPerformer": {
      "symbol": "MSFT",
      "profitLossPercentage": -5.2,
      "profitLoss": -104
    },
    "topHoldings": [
      {
        "symbol": "AAPL",
        "currentPrice": 165,
        "quantity": 10,
        "investedAmount": 1500,
        "currentHoldingValue": 1650,
        "profitLoss": 150,
        "profitLossPercentage": 10.0,
        "percentageOfPortfolio": 33.33
      },
      ...
    ]
  }
}
```

### Get Portfolio Distribution 
```
GET /dashboard/distribution
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "distribution": [
      {
        "symbol": "AAPL",
        "value": 1650,
        "quantity": 10,
        "percentage": 75
      },
      {
        "symbol": "GOOGL",
        "value": 550,
        "quantity": 5,
        "percentage": 25
      }
    ],
    "totalValue": 82500
  }
}
```

### Get Portfolio Performance 
```
GET /dashboard/performance?days=30
Authorization: Bearer <token>

Query Parameters:
- days: Optional, number of days to look back - default: 30

Response: 200 OK
{
  "success": true,
  "data": {
    "performance": [
      {
        "date": "2024-01-10",
        "totalInvested": 25000
      },
      {
        "date": "2024-01-15",
        "totalInvested": 50000
      },
      ...
    ],
    "period": "30 days"
  }
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required or invalid token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get Holdings
```bash
curl -X GET http://localhost:5000/api/holdings \
  -H "Authorization: Bearer <your_token>"
```

### Add Holding
```bash
curl -X POST http://localhost:5000/api/holdings \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "purchasePrice": 150,
    "quantity": 10,
    "purchaseDate": "2024-01-10"
  }'
```

---

## Testing with Postman

1. **Set Base URL** in Postman environment: `http://localhost:5000/api`

2. **Create Auth Token Variable**:
   - Register a user
   - Copy the `token` from response
   - Set collection variable: `{{token}}`

3. **Use Token in Headers**:
   - Add header: `Authorization: Bearer {{token}}`

4. **Test Each Endpoint**:
   - Use the endpoints listed above
   - Verify responses match expected format

---

## Rate Limiting & Quotas

- **TwelveData API**: 800 requests/day (free tier)
- **Price Cache**: 1 hour TTL
- **JWT Token**: 7 days expiration

---

## Tips

1. Always include `Content-Type: application/json` header for POST/PUT requests
2. Stock symbols are case-insensitive (automatically converted to uppercase)
3. Dates should be in `YYYY-MM-DD` format
4. Keep JWT tokens secure and never expose them
5. Token expires after 7 days - users need to login again
