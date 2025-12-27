# Backend API - Trinity Inventory Apps

Backend API untuk Aplikasi Inventori Aset menggunakan NestJS, PostgreSQL, dan Prisma.

## Struktur Proyek

```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   │
│   ├── common/                 # Shared utilities
│   │   ├── decorators/         # Custom decorators
│   │   ├── filters/            # Exception filters
│   │   ├── guards/             # Auth guards
│   │   ├── interceptors/       # Request/Response interceptors
│   │   ├── pipes/              # Validation pipes
│   │   └── utils/              # Shared utilities
│   │
│   ├── config/                 # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   │
│   ├── shared/                 # Shared modules
│   │   └── prisma/             # Prisma service & module
│   │
│   ├── auth/                   # Authentication module
│   ├── users/                  # Users module
│   ├── assets/                 # Assets module
│   ├── requests/               # Requests module
│   ├── transactions/           # Transactions module
│   ├── customers/              # Customers module
│   ├── maintenance/            # Maintenance module
│   ├── categories/             # Categories module
│   ├── divisions/              # Divisions module
│   ├── notifications/          # Notifications module
│   └── health/                 # Health check module
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seed
│
├── test/                       # E2E tests
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- pnpm atau npm

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### Development

```bash
# Start in development mode
npm run start:dev

# Start in debug mode
npm run start:debug
```

### Production

```bash
# Build
npm run build

# Start production server
npm run start:prod
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/trinity_asset"
JWT_SECRET="your-secret-key-min-64-characters"
JWT_EXPIRATION="12h"
JWT_REFRESH_EXPIRATION="7d"
PORT=3001
NODE_ENV=production
```

## API Documentation

Once the server is running, API documentation is available at:
- Swagger UI: `http://localhost:3001/api/docs` (when implemented)

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Database Migrations

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## License

MIT

