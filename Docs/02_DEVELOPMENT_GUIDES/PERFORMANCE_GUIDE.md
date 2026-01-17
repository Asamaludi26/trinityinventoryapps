# Performance Optimization Guide

Panduan komprehensif untuk mengoptimalkan performa aplikasi Trinity Asset Flow di Frontend (React) dan Backend (NestJS).

---

## 1. Performance Goals

### 1.1. Core Web Vitals Targets

| Metric                             | Target  | Description                     |
| ---------------------------------- | ------- | ------------------------------- |
| **LCP** (Largest Contentful Paint) | < 2.5s  | Waktu load konten terbesar      |
| **FID** (First Input Delay)        | < 100ms | Responsivitas interaksi pertama |
| **CLS** (Cumulative Layout Shift)  | < 0.1   | Stabilitas visual layout        |
| **TTFB** (Time to First Byte)      | < 600ms | Waktu respons server pertama    |
| **TTI** (Time to Interactive)      | < 3.8s  | Waktu sampai halaman interaktif |

### 1.2. Application-Specific Goals

| Metric                   | Target  |
| ------------------------ | ------- |
| Initial Page Load        | < 3s    |
| Route Navigation         | < 500ms |
| API Response Time (P95)  | < 500ms |
| Table Render (1000 rows) | < 1s    |
| Search/Filter Response   | < 200ms |
| Form Submission Feedback | < 100ms |

---

## 2. Frontend Performance

### 2.1. React Component Optimization

#### 2.1.1. Memoization

```typescript
// ✅ Use React.memo for expensive pure components
const AssetCard = React.memo(({ asset }: { asset: Asset }) => {
    return (
        <div className="asset-card">
            <h3>{asset.name}</h3>
            <p>{asset.category}</p>
        </div>
    );
});

// ✅ Custom comparison function for complex props
const AssetTable = React.memo(
    ({ assets, onSelect }: AssetTableProps) => {
        return (/* table rendering */);
    },
    (prevProps, nextProps) => {
        // Only re-render if assets array actually changed
        return prevProps.assets === nextProps.assets &&
               prevProps.onSelect === nextProps.onSelect;
    }
);
```

#### 2.1.2. useMemo & useCallback

```typescript
// ✅ Memoize expensive calculations
const AssetList = ({ assets, filter }: Props) => {
    // Memoize filtered results
    const filteredAssets = useMemo(() => {
        return assets.filter(asset =>
            asset.name.toLowerCase().includes(filter.toLowerCase()) ||
            asset.category.toLowerCase().includes(filter.toLowerCase())
        );
    }, [assets, filter]);

    // Memoize callback to prevent child re-renders
    const handleSelect = useCallback((id: string) => {
        setSelectedId(id);
    }, []);

    return (
        <ul>
            {filteredAssets.map(asset => (
                <AssetItem
                    key={asset.id}
                    asset={asset}
                    onSelect={handleSelect}
                />
            ))}
        </ul>
    );
};
```

#### 2.1.3. State Colocation

```typescript
// ❌ DON'T: State too high in tree
const App = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <Layout>
            <Sidebar />
            <Main>
                <SearchInput value={searchTerm} onChange={setSearchTerm} />
                <AssetList filter={searchTerm} />
            </Main>
        </Layout>
    );
};

// ✅ DO: Colocate state where needed
const AssetSection = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <>
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
            <AssetList filter={searchTerm} />
        </>
    );
};
```

### 2.2. Zustand Store Optimization

#### 2.2.1. Selective Subscriptions

```typescript
// ❌ DON'T: Subscribe to entire store
const Component = () => {
    const store = useAssetStore(); // Re-renders on ANY store change
    return <div>{store.assets.length}</div>;
};

// ✅ DO: Select only what you need
const Component = () => {
    const assetCount = useAssetStore(state => state.assets.length);
    return <div>{assetCount}</div>;
};

// ✅ DO: Use shallow comparison for objects
import { shallow } from 'zustand/shallow';

const Component = () => {
    const { name, category } = useAssetStore(
        state => ({ name: state.selectedAsset?.name, category: state.selectedAsset?.category }),
        shallow
    );
    return <div>{name} - {category}</div>;
};
```

#### 2.2.2. Derived State Optimization

```typescript
// ✅ Create selectors for derived state
const selectActiveAssets = (state: AssetStore) =>
  state.assets.filter((a) => a.status === "active");

const selectAssetsByCategory = (category: string) => (state: AssetStore) =>
  state.assets.filter((a) => a.category === category);

// Usage
const activeAssets = useAssetStore(selectActiveAssets);
const networkingAssets = useAssetStore(selectAssetsByCategory("Networking"));
```

### 2.3. Bundle Optimization

#### 2.3.1. Code Splitting

```typescript
// ✅ Lazy load routes
const AssetRegistration = lazy(() => import('./features/assetRegistration'));
const UserManagement = lazy(() => import('./features/users'));
const Reports = lazy(() => import('./features/reports'));

// App.tsx
<Suspense fallback={<PageLoader />}>
    <Routes>
        <Route path="/assets" element={<AssetRegistration />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/reports" element={<Reports />} />
    </Routes>
</Suspense>
```

#### 2.3.2. Dynamic Imports

```typescript
// ✅ Lazy load heavy components
const ChartComponent = lazy(() => import("./components/Chart"));
const ExcelExporter = lazy(() => import("./utils/excelExport"));

// Load on demand
const handleExport = async () => {
  const { exportToExcel } = await import("./utils/excelExport");
  exportToExcel(data);
};
```

#### 2.3.3. Tree Shaking Best Practices

```typescript
// ❌ DON'T: Import entire library
import * as lodash from 'lodash';
import { icons } from 'lucide-react';

// ✅ DO: Import only what you need
import debounce from 'lodash/debounce';
import { Search, User, Settings } from 'lucide-react';

// ❌ DON'T: Barrel exports with unused items
import { Button, Input, Modal, Table, Chart, Tooltip, ... } from '@/components/ui';

// ✅ DO: Direct imports for large components
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
```

### 2.4. Rendering Optimization

#### 2.4.1. Virtualization for Large Lists

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedAssetList = ({ assets }: { assets: Asset[] }) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: assets.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 60, // estimated row height
        overscan: 5,
    });

    return (
        <div ref={parentRef} className="h-[600px] overflow-auto">
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    position: 'relative',
                }}
            >
                {virtualizer.getVirtualItems().map(virtualRow => (
                    <div
                        key={virtualRow.key}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        <AssetRow asset={assets[virtualRow.index]} />
                    </div>
                ))}
            </div>
        </div>
    );
};
```

#### 2.4.2. Debouncing User Input

```typescript
import { useDebouncedCallback } from 'use-debounce';

const SearchInput = ({ onSearch }: { onSearch: (term: string) => void }) => {
    const [value, setValue] = useState('');

    const debouncedSearch = useDebouncedCallback(
        (searchTerm: string) => {
            onSearch(searchTerm);
        },
        300 // 300ms delay
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedSearch(newValue);
    };

    return <input value={value} onChange={handleChange} />;
};
```

#### 2.4.3. Avoiding Layout Thrashing

```typescript
// ❌ DON'T: Multiple layout reads/writes
items.forEach((item) => {
  const height = element.offsetHeight; // Read
  element.style.height = `${height + 10}px`; // Write
});

// ✅ DO: Batch reads then batch writes
const heights = items.map(() => element.offsetHeight); // All reads
items.forEach((item, i) => {
  element.style.height = `${heights[i] + 10}px`; // All writes
});
```

### 2.5. Image Optimization

```typescript
// ✅ Lazy loading images
<img
    src={asset.thumbnail}
    loading="lazy"
    alt={asset.name}
    width={200}
    height={150}
/>

// ✅ Responsive images
<picture>
    <source media="(max-width: 768px)" srcSet={asset.thumbnailSmall} />
    <source media="(min-width: 769px)" srcSet={asset.thumbnail} />
    <img src={asset.thumbnail} alt={asset.name} loading="lazy" />
</picture>

// ✅ Using modern formats
const imageUrl = supportsWebP
    ? asset.imageWebP
    : asset.imagePng;
```

---

## 3. Backend Performance (NestJS)

### 3.1. Database Optimization

#### 3.1.1. Query Optimization

```typescript
// ❌ DON'T: N+1 problem
const assets = await this.prisma.asset.findMany();
for (const asset of assets) {
  asset.category = await this.prisma.category.findUnique({
    where: { id: asset.categoryId },
  });
}

// ✅ DO: Use includes/joins
const assets = await this.prisma.asset.findMany({
  include: {
    category: true,
    owner: {
      select: { id: true, name: true },
    },
  },
});

// ✅ DO: Select only needed fields
const assetNames = await this.prisma.asset.findMany({
  select: {
    id: true,
    name: true,
    status: true,
  },
});
```

#### 3.1.2. Pagination

```typescript
// ✅ Cursor-based pagination (more efficient for large datasets)
async findManyPaginated(cursor?: string, limit = 20) {
    const assets = await this.prisma.asset.findMany({
        take: limit + 1, // Take one extra to check if there's more
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0, // Skip cursor itself
        orderBy: { createdAt: 'desc' },
    });

    const hasMore = assets.length > limit;
    const items = hasMore ? assets.slice(0, -1) : assets;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return { items, nextCursor, hasMore };
}

// ✅ Offset-based pagination (for simple cases)
async findWithPagination(page = 1, limit = 20) {
    const [items, total] = await Promise.all([
        this.prisma.asset.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        this.prisma.asset.count(),
    ]);

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
```

#### 3.1.3. Indexing Strategy

```prisma
// schema.prisma
model Asset {
    id        String   @id @default(cuid())
    name      String
    category  String
    status    AssetStatus
    ownerId   String?
    createdAt DateTime @default(now())

    // Indexes for common queries
    @@index([category])
    @@index([status])
    @@index([ownerId])
    @@index([createdAt])
    @@index([category, status]) // Composite index
    @@index([name], map: "asset_name_search") // For text search
}
```

### 3.2. Caching

#### 3.2.1. In-Memory Caching with Cache Manager

```typescript
// src/common/cache/cache.module.ts
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // 5 minutes default
      max: 1000, // max items in cache
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}

// Usage in service
@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
  ) {}

  async findAll(): Promise<Category[]> {
    const cacheKey = "categories:all";

    // Check cache first
    const cached = await this.cacheManager.get<Category[]>(cacheKey);
    if (cached) return cached;

    // Fetch from DB
    const categories = await this.prisma.category.findMany();

    // Store in cache
    await this.cacheManager.set(cacheKey, categories, 600); // 10 min TTL

    return categories;
  }

  async invalidateCache(): Promise<void> {
    await this.cacheManager.del("categories:all");
  }
}
```

#### 3.2.2. Redis Caching (Production)

```typescript
// src/common/cache/redis.config.ts
import * as redisStore from "cache-manager-redis-store";

CacheModule.registerAsync({
  useFactory: () => ({
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    ttl: 300,
  }),
});
```

#### 3.2.3. HTTP Cache Headers

```typescript
// Controller-level caching
@Controller("categories")
export class CategoriesController {
  @Get()
  @Header("Cache-Control", "public, max-age=300") // 5 min
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  @Header("Cache-Control", "private, max-age=60")
  async findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }
}

// Using interceptor for dynamic caching
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        response.setHeader("Cache-Control", "public, max-age=60");
        response.setHeader("ETag", this.generateETag(data));
      }),
    );
  }
}
```

### 3.3. Request Processing

#### 3.3.1. Compression

```typescript
// main.ts
import * as compression from "compression";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    compression({
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) return false;
        return compression.filter(req, res);
      },
      threshold: 1024, // Only compress responses > 1KB
    }),
  );

  await app.listen(3000);
}
```

#### 3.3.2. Rate Limiting

```typescript
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000, // 1 second
        limit: 3, // 3 requests per second
      },
      {
        name: "medium",
        ttl: 10000, // 10 seconds
        limit: 20,
      },
      {
        name: "long",
        ttl: 60000, // 1 minute
        limit: 100,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### 3.4. Connection Pooling

```typescript
// prisma configuration
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

// DATABASE_URL example with pooling
// postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=30

// Or use PgBouncer for external pooling
// postgresql://user:pass@pgbouncer:6432/db?pgbouncer=true
```

---

## 4. Network Optimization

### 4.1. API Response Optimization

```typescript
// ✅ Minimal response payloads
interface AssetListItemDTO {
    id: string;
    name: string;
    status: string;
    thumbnail?: string;
}

interface AssetDetailDTO extends AssetListItemDTO {
    description: string;
    specifications: Record<string, any>;
    history: ActivityLog[];
    // ... full details
}

// List endpoint returns minimal data
@Get()
async findAll(): Promise<AssetListItemDTO[]> {
    return this.assetsService.findAllMinimal();
}

// Detail endpoint returns full data
@Get(':id')
async findOne(@Param('id') id: string): Promise<AssetDetailDTO> {
    return this.assetsService.findOneFull(id);
}
```

### 4.2. Data Prefetching

```typescript
// Frontend: Prefetch on hover
const AssetLink = ({ assetId }: { assetId: string }) => {
    const prefetchAsset = useAssetStore(state => state.prefetchAsset);

    return (
        <Link
            to={`/assets/${assetId}`}
            onMouseEnter={() => prefetchAsset(assetId)}
        >
            View Asset
        </Link>
    );
};

// Store implementation
prefetchAsset: async (id: string) => {
    const cached = get().assetCache[id];
    if (cached) return;

    const asset = await api.assets.getById(id);
    set(state => ({
        assetCache: { ...state.assetCache, [id]: asset }
    }));
}
```

---

## 5. Monitoring Performance

### 5.1. Frontend Performance Metrics

```typescript
// utils/performanceMonitor.ts
export const measurePageLoad = () => {
  if (typeof window === "undefined") return;

  window.addEventListener("load", () => {
    const performance = window.performance;
    const timing = performance.timing;

    const metrics = {
      // Navigation timing
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      ttfb: timing.responseStart - timing.requestStart,
      download: timing.responseEnd - timing.responseStart,
      domParsing: timing.domInteractive - timing.responseEnd,
      domContentLoaded:
        timing.domContentLoadedEventEnd - timing.navigationStart,
      pageLoad: timing.loadEventEnd - timing.navigationStart,
    };

    // Send to analytics
    logger.info("Page load metrics", metrics);
  });
};

// Component render timing
export const useRenderTiming = (componentName: string) => {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    if (renderTime > 100) {
      logger.warn(`Slow render: ${componentName}`, { renderTime });
    }
  }, []);
};
```

### 5.2. Backend Performance Metrics

```typescript
// Interceptor for timing all requests
@Injectable()
export class TimingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;

        if (duration > 1000) {
          this.logger.warn("Slow request", {
            method: request.method,
            path: request.url,
            durationMs: duration,
          });
        }

        // Emit metric for monitoring
        this.emitMetric("http_request_duration_ms", duration, {
          method: request.method,
          path: request.route?.path,
          status: context.switchToHttp().getResponse().statusCode,
        });
      }),
    );
  }
}
```

---

## 6. Performance Checklist

### 6.1. Frontend Checklist

| Category      | Item                                | Priority  |
| ------------- | ----------------------------------- | --------- |
| **Bundle**    | Code splitting implemented          | 🔴 High   |
| **Bundle**    | Tree shaking verified               | 🔴 High   |
| **Bundle**    | Bundle size < 200KB (gzipped)       | 🟡 Medium |
| **Rendering** | React.memo for expensive components | 🔴 High   |
| **Rendering** | useMemo/useCallback appropriately   | 🟡 Medium |
| **Rendering** | Virtualization for long lists       | 🔴 High   |
| **State**     | Selective Zustand subscriptions     | 🔴 High   |
| **State**     | Derived state memoized              | 🟡 Medium |
| **Network**   | API responses optimized             | 🔴 High   |
| **Network**   | Images lazy loaded                  | 🟡 Medium |
| **UX**        | Loading states implemented          | 🟡 Medium |
| **UX**        | Skeleton loaders used               | 🟢 Low    |

### 6.2. Backend Checklist

| Category       | Item                            | Priority  |
| -------------- | ------------------------------- | --------- |
| **Database**   | Indexes on query fields         | 🔴 High   |
| **Database**   | N+1 queries eliminated          | 🔴 High   |
| **Database**   | Pagination implemented          | 🔴 High   |
| **Database**   | Connection pooling configured   | 🔴 High   |
| **Caching**    | Frequently accessed data cached | 🟡 Medium |
| **Caching**    | Cache invalidation strategy     | 🟡 Medium |
| **API**        | Response compression enabled    | 🔴 High   |
| **API**        | Rate limiting configured        | 🟡 Medium |
| **API**        | Minimal response payloads       | 🟡 Medium |
| **Monitoring** | Request timing logged           | 🟡 Medium |
| **Monitoring** | Slow query alerts               | 🟡 Medium |

---

## 7. Quick Wins

### Immediate Performance Improvements

1. **Enable Gzip Compression** - 70% reduction in transfer size
2. **Add Database Indexes** - 10x faster queries
3. **Implement Pagination** - Constant memory usage
4. **Use React.lazy** - 50% smaller initial bundle
5. **Selective Zustand Subscriptions** - Fewer re-renders
6. **Debounce Search Inputs** - Fewer API calls
7. **Cache Static Data** - Instant repeated loads
8. **Lazy Load Images** - Faster initial paint
