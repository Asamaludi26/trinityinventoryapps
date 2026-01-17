# =============================================================================
# Backend Dockerfile
# Trinity Asset Flow - NestJS API Server
# =============================================================================
# Build: docker build -t trinity-backend -f Dockerfile .
# Run:   docker run -d -p 3001:3001 trinity-backend
# =============================================================================

# Stage 1: Build
FROM node:20-alpine AS builder

# Install pnpm and build tools
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN pnpm prisma generate

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Remove devDependencies
RUN pnpm prune --prod

# Stage 2: Production
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl

# Create non-root user
RUN addgroup -g 1001 -S trinity && \
    adduser -S trinity -u 1001 -G trinity

# Set working directory
WORKDIR /app

# Copy production dependencies
COPY --from=builder --chown=trinity:trinity /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=trinity:trinity /app/dist ./dist

# Copy Prisma files
COPY --from=builder --chown=trinity:trinity /app/prisma ./prisma

# Copy package.json for version info
COPY --from=builder --chown=trinity:trinity /app/package.json ./

# Switch to non-root user
USER trinity

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Environment
ENV NODE_ENV=production
ENV PORT=3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
