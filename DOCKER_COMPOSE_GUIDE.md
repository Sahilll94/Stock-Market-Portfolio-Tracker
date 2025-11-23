# Docker Compose Files Guide

This project includes multiple docker-compose configurations for different scenarios:

## Files Overview

### 1. `docker-compose.yml` - Local Development
**Use this for:** Development with local MongoDB

```bash
docker-compose up -d
```

**Includes:**
- ✅ Frontend (Nginx)
- ✅ Backend (Node.js)
- ✅ MongoDB (Local container)

**Best for:**
- Local development
- Testing without external dependencies
- Working offline

---

### 2. `docker-compose.prod.yml` - Production with MongoDB Atlas
**Use this for:** Production deployment with cloud database

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Includes:**
- ✅ Frontend (Nginx)
- ✅ Backend (Node.js)
- ❌ MongoDB (uses MongoDB Atlas cloud)

**Best for:**
- Production deployments
- Shared team environments
- Scalable setup

**Requirements:**
- MongoDB Atlas account and connection string in `.env`

---

### 3. `docker-compose.dev.yml` - Development with Hot Reload
**Use this for:** Active development with live code changes

```bash
docker-compose -f docker-compose.dev.yml up
```

**Features:**
- Hot reload on code changes
- Source code mounted as volumes
- Easier debugging
- Console logs visible

**Best for:**
- Active development
- Debugging
- Learning Docker setup

---

## Quick Decision Guide

| Scenario | Command | File |
|----------|---------|------|
| **Learning Docker** | `docker-compose -f docker-compose.dev.yml up` | dev |
| **Local Testing** | `docker-compose up -d` | yml |
| **Production** | `docker-compose -f docker-compose.prod.yml up -d` | prod |
| **CI/CD Pipeline** | `docker-compose -f docker-compose.prod.yml up -d` | prod |
| **Offline Development** | `docker-compose up -d` | yml |
| **Team Collaboration** | `docker-compose -f docker-compose.prod.yml up -d` | prod |

---

## Common Commands

### Start Services
```bash
# Local development (with local MongoDB)
docker-compose up -d

# Production (with MongoDB Atlas)
docker-compose -f docker-compose.prod.yml up -d

# Development with hot reload
docker-compose -f docker-compose.dev.yml up
```

### Stop Services
```bash
docker-compose down                    # Keep data
docker-compose down -v                 # Remove data/volumes
docker-compose -f docker-compose.prod.yml down
```

### View Logs
```bash
docker-compose logs -f                 # All services
docker-compose logs -f backend         # Specific service
docker-compose logs --tail=50 backend  # Last 50 lines
```

### Rebuild Images
```bash
docker-compose build --no-cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

---

## Environment Setup

### Before Running

1. **Copy template to actual .env file:**
   ```bash
   cp .env.docker .env
   ```

2. **Edit .env with your credentials:**
   ```bash
   # For production (MongoDB Atlas)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

   # For local development (commented out for prod)
   # MONGODB_USER=mongouser
   # MONGODB_PASSWORD=password
   # MONGODB_NAME=portfolioDB
   ```

3. **Add Firebase credentials (all files need this):**
   - Backend service account (FIREBASE_*)
   - Frontend web config (VITE_FIREBASE_*)

4. **Add API keys:**
   - TWELVEDATA_API_KEY
   - JWT_SECRET

---

## Switching Between Configurations

### From Local to Production
```bash
# Stop local setup
docker-compose down

# Update .env with MongoDB Atlas URI
nano .env

# Start production setup
docker-compose -f docker-compose.prod.yml up -d
```

### From Production to Development
```bash
# Stop production setup
docker-compose -f docker-compose.prod.yml down

# Comment MONGODB_URI and uncomment MONGODB_USER/PASSWORD
nano .env

# Start local setup
docker-compose up -d
```

---

## Troubleshooting

### "Port already in use"
```bash
# Find which process is using the port
netstat -ano | findstr :5000
netstat -ano | findstr :80

# Kill the process (Windows)
taskkill /PID <PID> /F
```

### "MongoDB connection failed"
- **Local**: Ensure `docker-compose ps` shows MongoDB container running
- **Atlas**: Verify connection string and IP whitelist in MongoDB Atlas console

### "Firebase error"
- Rebuild frontend after changing `.env`:
  ```bash
  docker-compose down
  docker-compose build --no-cache frontend
  docker-compose up -d
  ```

---

## Performance Tips

- Use `docker-compose -f docker-compose.prod.yml` for production (no local MongoDB overhead)
- Use `docker-compose.yml` for development only
- Use `docker-compose.dev.yml` for active development with code changes

---

For detailed setup instructions, see **DOCKER_SETUP.md**
