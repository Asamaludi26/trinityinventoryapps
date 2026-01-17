# Standar Logging & Monitoring

Dokumen ini mendefinisikan standar logging, monitoring, dan observability untuk aplikasi Trinity Asset Flow di seluruh stack (Frontend dan Backend).

---

## 1. Filosofi Logging

### 1.1. Tujuan Logging

| Tujuan         | Deskripsi                                   |
| -------------- | ------------------------------------------- |
| **Debugging**  | Membantu developer melacak masalah          |
| **Auditing**   | Mencatat aktivitas user untuk kepatuhan     |
| **Monitoring** | Mendeteksi anomali dan masalah performa     |
| **Analytics**  | Memahami perilaku pengguna                  |
| **Security**   | Mendeteksi dan investigasi insiden keamanan |

### 1.2. Prinsip Logging

| Prinsip                | Deskripsi                                               |
| ---------------------- | ------------------------------------------------------- |
| **Structured Logging** | Log dalam format JSON untuk parsing otomatis            |
| **Contextual**         | Sertakan context yang relevan (userId, requestId, etc.) |
| **Appropriate Level**  | Gunakan log level yang tepat                            |
| **No Sensitive Data**  | Jangan log password, token, atau PII sensitif           |
| **Actionable**         | Log harus membantu dalam mengambil tindakan             |

---

## 2. Log Levels

### 2.1. Level Definitions

| Level     | Kode | Kapan Digunakan                        | Contoh                                          |
| --------- | ---- | -------------------------------------- | ----------------------------------------------- |
| **ERROR** | 0    | Error yang memerlukan perhatian segera | Database connection failed, Unhandled exception |
| **WARN**  | 1    | Situasi tidak normal tapi tidak kritis | Deprecated API call, Rate limit approaching     |
| **INFO**  | 2    | Event bisnis penting                   | User login, Request approved, Asset created     |
| **DEBUG** | 3    | Informasi untuk debugging              | Function parameters, State changes              |
| **TRACE** | 4    | Detail sangat granular                 | SQL queries, HTTP request/response bodies       |

### 2.2. Level Configuration by Environment

| Environment | Default Level | Production Recommendation             |
| ----------- | ------------- | ------------------------------------- |
| Development | DEBUG         | -                                     |
| Staging     | DEBUG         | -                                     |
| Production  | INFO          | ERROR for external, INFO for internal |

---

## 3. Log Format

### 3.1. Structured Log Schema

Semua log harus menggunakan format JSON dengan field standar:

```json
{
  "timestamp": "2026-01-17T10:30:00.123Z",
  "level": "INFO",
  "service": "assetflow-backend",
  "environment": "production",
  "message": "Asset created successfully",
  "context": {
    "requestId": "req-abc123",
    "userId": 42,
    "userRole": "Admin Logistik",
    "traceId": "trace-xyz789"
  },
  "data": {
    "assetId": "AST-2026-000001",
    "category": "Networking",
    "action": "CREATE"
  },
  "performance": {
    "durationMs": 125
  },
  "error": null
}
```

### 3.2. Field Definitions

| Field               | Type     | Required | Description                                          |
| ------------------- | -------- | -------- | ---------------------------------------------------- |
| `timestamp`         | ISO 8601 | ✅       | Waktu log dalam UTC                                  |
| `level`             | string   | ✅       | Log level (ERROR, WARN, INFO, DEBUG, TRACE)          |
| `service`           | string   | ✅       | Nama service (assetflow-frontend, assetflow-backend) |
| `environment`       | string   | ✅       | Environment (development, staging, production)       |
| `message`           | string   | ✅       | Pesan log yang dapat dibaca manusia                  |
| `context`           | object   | ✅       | Konteks request/user                                 |
| `context.requestId` | string   | ⚠️       | Unique ID per request                                |
| `context.userId`    | number   | ⚠️       | ID user yang melakukan aksi                          |
| `context.traceId`   | string   | ⚠️       | Distributed tracing ID                               |
| `data`              | object   | ❌       | Data spesifik event                                  |
| `performance`       | object   | ❌       | Metrik performa                                      |
| `error`             | object   | ❌       | Detail error (jika ada)                              |

### 3.3. Error Object Schema

```json
{
  "error": {
    "name": "ValidationError",
    "code": "VALIDATION_ERROR",
    "message": "Email format tidak valid",
    "stack": "Error: Email format tidak valid\n    at validate (/app/src/...",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

---

## 4. Frontend Logging

### 4.1. Logger Service

**Lokasi**: `src/utils/logger.ts`

```typescript
type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  environment: string;
  message: string;
  context: {
    userId?: number;
    userRole?: string;
    page?: string;
    sessionId?: string;
  };
  data?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private service = "assetflow-frontend";
  private environment = import.meta.env.MODE || "development";
  private minLevel: LogLevel = import.meta.env.PROD ? "INFO" : "DEBUG";

  private levelPriority: Record<LogLevel, number> = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    TRACE: 4,
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] <= this.levelPriority[this.minLevel];
  }

  private getContext(): LogEntry["context"] {
    // Get from auth store
    const user = useAuthStore?.getState?.()?.currentUser;
    const page = useUIStore?.getState?.()?.activePage;

    return {
      userId: user?.id,
      userRole: user?.role,
      page,
      sessionId: sessionStorage.getItem("sessionId") || undefined,
    };
  }

  private createEntry(
    level: LogLevel,
    message: string,
    data?: Record<string, any>,
    error?: Error,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      environment: this.environment,
      message,
      context: this.getContext(),
      data,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };
  }

  private output(entry: LogEntry): void {
    const method =
      entry.level === "ERROR"
        ? "error"
        : entry.level === "WARN"
          ? "warn"
          : "log";

    if (this.environment === "production") {
      // Send to logging service (e.g., Sentry, LogRocket)
      this.sendToServer(entry);
    }

    // Console output for development
    console[method](`[${entry.level}]`, entry.message, entry);
  }

  private async sendToServer(entry: LogEntry): Promise<void> {
    // Implementasi pengiriman ke server logging
    // Contoh: Sentry, LogRocket, custom endpoint
    if (entry.level === "ERROR" && entry.error) {
      // Sentry.captureException(entry.error);
    }
  }

  error(message: string, error?: Error, data?: Record<string, any>): void {
    if (this.shouldLog("ERROR")) {
      this.output(this.createEntry("ERROR", message, data, error));
    }
  }

  warn(message: string, data?: Record<string, any>): void {
    if (this.shouldLog("WARN")) {
      this.output(this.createEntry("WARN", message, data));
    }
  }

  info(message: string, data?: Record<string, any>): void {
    if (this.shouldLog("INFO")) {
      this.output(this.createEntry("INFO", message, data));
    }
  }

  debug(message: string, data?: Record<string, any>): void {
    if (this.shouldLog("DEBUG")) {
      this.output(this.createEntry("DEBUG", message, data));
    }
  }

  trace(message: string, data?: Record<string, any>): void {
    if (this.shouldLog("TRACE")) {
      this.output(this.createEntry("TRACE", message, data));
    }
  }
}

export const logger = new Logger();
```

### 4.2. Usage Examples

```typescript
// Error logging
try {
  await saveAsset(data);
} catch (error) {
  logger.error("Failed to save asset", error as Error, {
    assetId: data.id,
    action: "CREATE",
  });
}

// Info logging for business events
logger.info("User logged in", {
  method: "email",
  rememberMe: true,
});

// Debug logging for development
logger.debug("Stock check result", {
  itemName: "Kabel UTP",
  available: 500,
  requested: 100,
  isSufficient: true,
});

// Warn for non-critical issues
logger.warn("Deprecated API endpoint called", {
  endpoint: "/api/v1/assets",
  suggestion: "Use /api/v2/assets instead",
});
```

---

## 5. Backend Logging (NestJS)

### 5.1. Winston Logger Setup

**Lokasi**: `src/common/logger/winston.config.ts`

```typescript
import { WinstonModule, utilities } from "nest-winston";
import * as winston from "winston";

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

export const winstonConfig = WinstonModule.createLogger({
  transports: [
    // Console transport (development)
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        utilities.format.nestLike("AssetFlow", { prettyPrint: true }),
      ),
    }),

    // File transport (production)
    new winston.transports.File({
      filename: "/var/log/assetflow/error.log",
      level: "error",
      format: customFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),

    new winston.transports.File({
      filename: "/var/log/assetflow/combined.log",
      level: "info",
      format: customFormat,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
    }),
  ],
});
```

### 5.2. Custom Logger Service

```typescript
// src/common/logger/logger.service.ts
import {
  Injectable,
  LoggerService as NestLoggerService,
  Scope,
} from "@nestjs/common";
import { Logger } from "winston";

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private context?: string;
  private requestContext?: {
    requestId: string;
    userId?: number;
    userRole?: string;
    path?: string;
    method?: string;
  };

  constructor(private readonly logger: Logger) {}

  setContext(context: string): this {
    this.context = context;
    return this;
  }

  setRequestContext(context: typeof this.requestContext): this {
    this.requestContext = context;
    return this;
  }

  private formatMessage(message: string, meta?: Record<string, any>) {
    return {
      message,
      context: this.context,
      ...this.requestContext,
      ...meta,
    };
  }

  log(message: string, meta?: Record<string, any>): void {
    this.logger.info(this.formatMessage(message, meta));
  }

  error(message: string, trace?: string, meta?: Record<string, any>): void {
    this.logger.error(
      this.formatMessage(message, {
        ...meta,
        stack: trace,
      }),
    );
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.logger.warn(this.formatMessage(message, meta));
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.logger.debug(this.formatMessage(message, meta));
  }

  verbose(message: string, meta?: Record<string, any>): void {
    this.logger.verbose(this.formatMessage(message, meta));
  }
}
```

### 5.3. Request Logging Middleware

```typescript
// src/common/middleware/request-logger.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { LoggerService } from "../logger/logger.service";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = (req.headers["x-request-id"] as string) || uuidv4();
    const startTime = Date.now();

    // Attach requestId to request
    req["requestId"] = requestId;
    res.setHeader("X-Request-Id", requestId);

    // Log incoming request
    this.logger.log("Incoming request", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      userId: (req as any).user?.id,
    });

    // Log response when finished
    res.on("finish", () => {
      const duration = Date.now() - startTime;
      const logLevel = res.statusCode >= 400 ? "warn" : "log";

      this.logger[logLevel]("Request completed", {
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: duration,
        userId: (req as any).user?.id,
      });
    });

    next();
  }
}
```

---

## 6. Activity Logging (Audit Trail)

### 6.1. Activity Log Schema

```typescript
interface ActivityLog {
  id: string;
  timestamp: string;

  // Who
  userId: number;
  userName: string;
  userRole: string;

  // What
  action: ActivityAction;
  entityType: EntityType;
  entityId: string;

  // Details
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];

  metadata?: Record<string, any>;

  // Context
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

type ActivityAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "CANCEL"
  | "LOGIN"
  | "LOGOUT"
  | "PASSWORD_RESET"
  | "ASSIGN"
  | "HANDOVER"
  | "RETURN";

type EntityType =
  | "Asset"
  | "Request"
  | "LoanRequest"
  | "Handover"
  | "User"
  | "Customer"
  | "Division"
  | "Category";
```

### 6.2. Activity Logger Service

```typescript
// src/common/services/activity-logger.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ActivityLoggerService {
  constructor(private prisma: PrismaService) {}

  async log(entry: Omit<ActivityLog, "id" | "timestamp">): Promise<void> {
    await this.prisma.activityLog.create({
      data: {
        ...entry,
        timestamp: new Date(),
        changes: entry.changes ? JSON.stringify(entry.changes) : null,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
      },
    });
  }

  async logCreate(
    user: User,
    entityType: EntityType,
    entityId: string,
    data: Record<string, any>,
    request?: Request,
  ): Promise<void> {
    await this.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "CREATE",
      entityType,
      entityId,
      metadata: data,
      ipAddress: request?.ip,
      userAgent: request?.headers["user-agent"],
      requestId: request?.["requestId"],
    });
  }

  async logUpdate(
    user: User,
    entityType: EntityType,
    entityId: string,
    oldData: Record<string, any>,
    newData: Record<string, any>,
    request?: Request,
  ): Promise<void> {
    const changes = this.calculateChanges(oldData, newData);

    if (changes.length === 0) return;

    await this.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "UPDATE",
      entityType,
      entityId,
      changes,
      ipAddress: request?.ip,
      userAgent: request?.headers["user-agent"],
      requestId: request?.["requestId"],
    });
  }

  private calculateChanges(
    oldData: Record<string, any>,
    newData: Record<string, any>,
  ): ActivityLog["changes"] {
    const changes: ActivityLog["changes"] = [];

    for (const key of Object.keys(newData)) {
      if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
        changes.push({
          field: key,
          oldValue: oldData[key],
          newValue: newData[key],
        });
      }
    }

    return changes;
  }
}
```

### 6.3. Usage in Services

```typescript
// src/assets/assets.service.ts
@Injectable()
export class AssetsService {
  constructor(
    private prisma: PrismaService,
    private activityLogger: ActivityLoggerService,
  ) {}

  async create(
    dto: CreateAssetDto,
    user: User,
    request: Request,
  ): Promise<Asset> {
    const asset = await this.prisma.asset.create({
      data: dto,
    });

    // Log the activity
    await this.activityLogger.logCreate(
      user,
      "Asset",
      asset.id,
      { name: asset.name, category: asset.category, type: asset.type },
      request,
    );

    return asset;
  }

  async update(
    id: string,
    dto: UpdateAssetDto,
    user: User,
    request: Request,
  ): Promise<Asset> {
    const oldAsset = await this.prisma.asset.findUnique({ where: { id } });

    const asset = await this.prisma.asset.update({
      where: { id },
      data: dto,
    });

    // Log the changes
    await this.activityLogger.logUpdate(
      user,
      "Asset",
      id,
      oldAsset,
      asset,
      request,
    );

    return asset;
  }
}
```

---

## 7. Sensitive Data Handling

### 7.1. Data yang TIDAK Boleh Di-Log

| Data Type      | Alasan   | Alternatif                   |
| -------------- | -------- | ---------------------------- |
| Password       | Security | Log hanya "password changed" |
| API Keys       | Security | Log hanya last 4 chars       |
| JWT Tokens     | Security | Log hanya token type         |
| Credit Card    | PCI DSS  | Log hanya last 4 digits      |
| NIK/KTP        | Privacy  | Log hanya hash atau mask     |
| Alamat Lengkap | Privacy  | Log hanya kota/kecamatan     |

### 7.2. Data Masking Utilities

```typescript
// src/utils/logSanitizer.ts
export const LogSanitizer = {
  maskEmail: (email: string): string => {
    const [local, domain] = email.split("@");
    return `${local.substring(0, 2)}***@${domain}`;
  },

  maskPhone: (phone: string): string => {
    return phone.replace(/(\d{4})\d{4,6}(\d{2})/, "$1****$2");
  },

  maskToken: (token: string): string => {
    return `${token.substring(0, 10)}...${token.substring(token.length - 4)}`;
  },

  maskPassword: (): string => {
    return "[REDACTED]";
  },

  sanitizeObject: <T extends Record<string, any>>(
    obj: T,
    sensitiveKeys: string[],
  ): T => {
    const result = { ...obj };

    for (const key of sensitiveKeys) {
      if (result[key] !== undefined) {
        if (key.toLowerCase().includes("password")) {
          result[key] = "[REDACTED]";
        } else if (key.toLowerCase().includes("email")) {
          result[key] = LogSanitizer.maskEmail(result[key]);
        } else if (key.toLowerCase().includes("phone")) {
          result[key] = LogSanitizer.maskPhone(result[key]);
        } else if (key.toLowerCase().includes("token")) {
          result[key] = LogSanitizer.maskToken(result[key]);
        } else {
          result[key] = "[SENSITIVE]";
        }
      }
    }

    return result;
  },
};
```

---

## 8. Monitoring & Alerting

### 8.1. Key Metrics to Monitor

| Category         | Metric            | Threshold  | Alert Level |
| ---------------- | ----------------- | ---------- | ----------- |
| **Availability** | Uptime            | < 99.9%    | 🔴 Critical |
| **Latency**      | P95 Response Time | > 2s       | 🟡 Warning  |
| **Latency**      | P99 Response Time | > 5s       | 🔴 Critical |
| **Errors**       | 5xx Error Rate    | > 1%       | 🔴 Critical |
| **Errors**       | 4xx Error Rate    | > 10%      | 🟡 Warning  |
| **Security**     | Failed Login Rate | > 10/min   | 🟡 Warning  |
| **Security**     | 401/403 Spike     | > 50/min   | 🔴 Critical |
| **Resources**    | CPU Usage         | > 80%      | 🟡 Warning  |
| **Resources**    | Memory Usage      | > 85%      | 🔴 Critical |
| **Database**     | Query Time        | > 500ms    | 🟡 Warning  |
| **Database**     | Connection Pool   | > 80% used | 🟡 Warning  |

### 8.2. Health Check Endpoint

```typescript
// src/health/health.controller.ts
import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from "@nestjs/terminus";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.db.pingCheck("database")]);
  }

  @Get("ready")
  readiness() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || "1.0.0",
    };
  }
}
```

---

## 9. Log Retention & Rotation

### 9.1. Retention Policy

| Log Type         | Retention | Storage                   |
| ---------------- | --------- | ------------------------- |
| Error Logs       | 90 days   | Hot storage               |
| Application Logs | 30 days   | Hot storage               |
| Access Logs      | 30 days   | Hot storage               |
| Audit Logs       | 7 years   | Cold storage (compliance) |
| Debug Logs       | 7 days    | Hot storage               |

### 9.2. Rotation Configuration

```bash
# /etc/logrotate.d/assetflow
/var/log/assetflow/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 deploy deploy
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## 10. Quick Reference

### 10.1. Logging Cheatsheet

```typescript
// ✅ DO
logger.error("Failed to process request", error, { requestId, userId });
logger.info("Asset created", { assetId, category, action: "CREATE" });
logger.debug("Stock check", { item, available, requested });

// ❌ DON'T
console.log("something happened"); // No context
logger.info("User password: " + password); // Sensitive data!
logger.error(error); // No message, just error object
logger.info("x"); // Meaningless message
```

### 10.2. When to Use Each Level

```
ERROR → "Something broke, needs immediate attention"
WARN  → "Something unexpected, but we can handle it"
INFO  → "Important business event happened"
DEBUG → "Here's what's happening under the hood"
TRACE → "Here's every little detail"
```
