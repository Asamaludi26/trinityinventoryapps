# Dockerfile untuk Frontend React (Production Build dengan Nginx)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
# Note: Environment variables harus di-inject saat build
ARG VITE_API_URL
ARG VITE_USE_MOCK
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_MOCK=$VITE_USE_MOCK

RUN pnpm run build

# Production stage dengan Nginx
FROM nginx:alpine

# Copy custom nginx config (akan di-override oleh volume di docker-compose)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files dari builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

