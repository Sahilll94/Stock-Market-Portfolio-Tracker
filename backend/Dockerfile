# Multi-stage Dockerfile for Node.js Backend
# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Development dependencies (for development builds)
FROM node:18-alpine AS dev-dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 3: Production build
FROM node:18-alpine AS production
WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy production dependencies from stage 1
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Run the application
CMD ["node", "server.js"]

# Stage 4: Development build (optional)
FROM node:18-alpine AS development
WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy all dependencies
COPY --from=dev-dependencies /app/node_modules ./node_modules

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["dumb-init", "--"]

# Run with nodemon for development
CMD ["npm", "run", "dev"]
