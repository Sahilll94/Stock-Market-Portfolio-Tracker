# Docker Setup Guide - Stock Market Portfolio Tracker

This guide explains how to run the Stock Market Portfolio Tracker using Docker and Docker Compose.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Running with Docker](#running-with-docker)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

## Prerequisites

1. **Docker Desktop** (includes Docker & Docker Compose)
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Install and start Docker Desktop
   - Verify installation: `docker --version` and `docker-compose --version`

2. **Firebase Project** (for Google OAuth)
   - [Create Firebase Project](https://console.firebase.google.com/)
   - Enable Google Authentication
   - Get Web App Config

3. **MongoDB Atlas Account** (optional, for cloud database)
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and get your connection string
   - Or use local MongoDB (included in Docker)

4. **TwelveData API Key** (for stock data)
   - [Get API Key](https://twelvedata.com/)

## Environment Setup

### Step 1: Create `.env` file

Copy `.env.docker` to `.env` in the project root:

```bash
cp .env.docker .env
```

### Step 2: Update `.env` with your credentials

Edit the `.env` file and add your credentials:

```dotenv
# ============================================
# MongoDB Configuration
# ============================================
# OPTION A: Use MongoDB Atlas (Cloud) - Recommended
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# OPTION B: Use Local Docker MongoDB (remove MONGODB_URI above)
# MONGODB_USER=your_username
# MONGODB_PASSWORD=your_password
# MONGODB_NAME=your_database_name

# ============================================
# Backend Configuration
# ============================================
JWT_SECRET=your_secure_jwt_secret_key_here
TWELVEDATA_API_KEY=your_twelvedata_api_key_here

# ============================================
# Firebase Backend (OAuth Token Verification)
# ============================================
# Get from Firebase Console → Project Settings → Service Accounts → Generate New Private Key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_firebase_client_id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...

# ============================================
# Firebase Frontend (Web App Config)
# ============================================
# Get from Firebase Console → Project Settings → Your Apps → Web App Config
VITE_FIREBASE_API_KEY=your_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=1:your_app_id:web:xxxxx
```

## Running with Docker

### Option 1: MongoDB Atlas (Production - Recommended)

For cloud MongoDB:

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

✅ **Pros:**
- Cloud database accessible from anywhere
- No local storage needed
- Automatic backups
- Scalable

### Option 2: Local Docker MongoDB (Development)

For local MongoDB container:

```bash
# Start services (includes local MongoDB)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

✅ **Pros:**
- No external dependencies
- Works offline
- Development-friendly

⚠️ **Note:** Data in local MongoDB is lost when container is removed. Use `docker-compose down` (without `-v`) to keep data.

## Usage

### Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Verify Services

```bash
# Check all containers
docker-compose ps                      # for local MongoDB
docker-compose -f docker-compose.prod.yml ps  # for MongoDB Atlas

# View backend logs
docker-compose logs backend
docker-compose logs -f backend         # follow logs in real-time

# View frontend logs
docker-compose logs frontend
```

### Common Commands

```bash
# Rebuild images after code changes
docker-compose up -d --build

# Start fresh (remove all containers and volumes)
docker-compose down -v
docker-compose up -d

# View environment variables in container
docker-compose exec backend env

# Connect to MongoDB (local only)
docker-compose exec mongodb mongosh -u your_username -p your_password

# Check container health
docker-compose ps
```

## Services

### 1. Frontend (Nginx)
- **Port**: 80 (HTTP) & 443 (HTTPS)
- **Image**: Node 20-alpine (build) + Nginx-alpine (production)
- **Features**:
  - Multi-stage build for optimized image size
  - SPA routing with Vite
  - API proxy to backend
  - Static file serving with caching
  - Security headers configured

### 2. Backend (Node.js)
- **Port**: 5000
- **Image**: Node 18-alpine
- **Features**:
  - Express.js REST API
  - Firebase OAuth integration
  - MongoDB connection
  - TwelveData API integration
  - Health checks enabled
  - Graceful shutdown with dumb-init

### 3. MongoDB (Optional - Local only)
- **Port**: 27017
- **Image**: mongo:latest
- **Features**:
  - User authentication enabled
  - Health checks configured
  - Data persistence with volumes
  - Used only in docker-compose.yml (not in docker-compose.prod.yml)

## Project Structure

```
.
├── backend/
│   ├── Dockerfile           # Node.js backend build
│   └── .dockerignore        # Exclude unnecessary files
├── frontend/
│   ├── Dockerfile           # React + Nginx build
│   ├── nginx.conf           # Nginx main config
│   ├── nginx-default.conf   # Nginx server config
│   └── .dockerignore        # Exclude unnecessary files
├── .env.docker              # Template environment file
├── .env                     # Your actual credentials (not committed)
├── docker-compose.yml       # Local development (with MongoDB)
└── docker-compose.prod.yml  # Production (MongoDB Atlas)
```

## Troubleshooting

### Containers not starting

1. **Check Docker is running**
   ```bash
   docker ps
   ```

2. **View container logs**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

3. **Rebuild images**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### MongoDB connection issues

**Local MongoDB:**
- Ensure MongoDB container is running: `docker-compose ps`
- Check credentials in `.env` match docker-compose.yml

**MongoDB Atlas:**
- Verify connection string in `.env` is correct
- Check IP whitelist in MongoDB Atlas console
- Ensure database user has correct permissions

### Port already in use

```bash
# Find process using port 80 or 5000
netstat -ano | findstr :5000
netstat -ano | findstr :80

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Firebase errors

**"Invalid API Key" error:**
- Verify `VITE_FIREBASE_API_KEY` in `.env`
- Ensure it's from Web App config, not Service Account
- Frontend needs rebuild after `.env` changes:
  ```bash
  docker-compose down
  docker-compose build --no-cache frontend
  docker-compose up -d
  ```

### No data showing in dashboard

1. Check MongoDB connection:
   ```bash
   docker-compose logs backend | grep "MongoDB Connected"
   ```

2. Verify correct database is being used:
   - Atlas: Check cluster in MongoDB Atlas console
   - Local: Check `MONGODB_NAME` in `.env`

3. Clear browser cache and reload

## Performance Tips

1. **Use named volumes** for MongoDB data persistence
2. **Multi-stage builds** reduce image size significantly
3. **Alpine-based images** for minimal overhead
4. **Health checks** automatically restart failing containers
5. **Security headers** configured in Nginx

## Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify `.env` file is correctly formatted
3. Ensure all prerequisites are installed
4. Check Docker Desktop is running
5. Try rebuilding: `docker-compose build --no-cache`

## Next Steps

1. Set up your `.env` file with credentials
2. Choose MongoDB option (Atlas or local)
3. Run `docker-compose up -d` or `docker-compose -f docker-compose.prod.yml up -d`
4. Open http://localhost in your browser
5. Log in with Google OAuth
6. Start tracking your portfolio!

---

**Last Updated**: November 24, 2025
