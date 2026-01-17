# ADR 006: Prisma sebagai Database ORM

- **Status**: Diterima
- **Tanggal**: 2025-11-01

## Konteks

Backend NestJS membutuhkan solusi untuk berinteraksi dengan database PostgreSQL. Pilihan ORM/query builder akan memengaruhi:

- Developer experience dan produktivitas
- Type safety dan code quality
- Performance query
- Migration management
- Maintainability jangka panjang

Alternatif yang dipertimbangkan:

1. **TypeORM**: ORM yang paling populer di ekosistem NestJS, Active Record dan Data Mapper patterns
2. **Prisma**: Modern ORM dengan fokus pada type safety dan developer experience
3. **Knex.js**: Query builder yang flexible (bukan ORM)
4. **Sequelize**: ORM mature dengan banyak fitur, tapi TypeScript support kurang optimal
5. **MikroORM**: ORM TypeScript-first dengan Data Mapper pattern

## Keputusan

Kami memutuskan untuk menggunakan **Prisma** sebagai ORM utama.

## Konsekuensi

### Keuntungan (Positif)

- **Type Safety**: Prisma Client di-generate dari schema, memberikan type-safe queries:

```typescript
// Fully typed - IDE autocomplete & compile-time checking
const asset = await prisma.asset.findUnique({
  where: { id },
  include: {
    category: true,
    owner: {
      select: { id: true, name: true, email: true },
    },
  },
});
// typeof asset is inferred correctly
```

- **Schema as Single Source of Truth**: `schema.prisma` menjadi dokumentasi struktur database:

```prisma
model Asset {
    id          String      @id @default(cuid())
    name        String
    category    Category    @relation(fields: [categoryId], references: [id])
    categoryId  String
    status      AssetStatus @default(ACTIVE)
    items       Item[]
    createdAt   DateTime    @default(now())
    updatedAt   DateTime    @updatedAt

    @@index([categoryId])
    @@index([status])
}
```

- **Prisma Migrate**: Type-safe migrations dengan versioning:

```bash
# Create migration
npx prisma migrate dev --name add_asset_serial_number

# Apply migrations in production
npx prisma migrate deploy
```

- **Prisma Studio**: GUI untuk browse dan edit data:

```bash
npx prisma studio
```

- **Relation Queries**: Intuitive syntax untuk queries dengan relations:

```typescript
// Nested writes
const request = await prisma.request.create({
  data: {
    type: "PROCUREMENT",
    requester: { connect: { id: userId } },
    items: {
      create: [
        { name: "Kabel UTP", quantity: 100 },
        { name: "RJ45", quantity: 200 },
      ],
    },
  },
  include: { items: true },
});
```

- **Connection Pooling**: Built-in connection pooling yang optimal.

### Kerugian (Negatif)

- **Raw SQL untuk Complex Queries**: Beberapa query kompleks memerlukan `$queryRaw`:

```typescript
// Complex aggregations might need raw SQL
const stats = await prisma.$queryRaw`
    SELECT category, COUNT(*) as count, SUM(value) as total
    FROM assets
    WHERE status = 'ACTIVE'
    GROUP BY category
`;
```

**Mitigasi**: Sebagian besar queries dalam aplikasi ini cukup standard dan bisa di-handle Prisma Client.

- **Schema Changes Require Regeneration**: Setiap perubahan schema memerlukan `prisma generate`.

  **Mitigasi**: Integrate ke development workflow dan CI/CD pipeline.

- **Binary Dependencies**: Prisma Engine adalah binary yang perlu di-download.

  **Mitigasi**: Pin binary target di CI/CD. Jarang menjadi masalah di praktik.

- **Learning Curve untuk Prisma Schema Language**: Syntax berbeda dari SQL atau TypeORM decorators.

  **Mitigasi**: Dokumentasi Prisma sangat baik dan tim cepat adaptasi.

## Integration dengan NestJS

### Module Setup

```typescript
// prisma/prisma.module.ts
import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### Prisma Service

```typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Usage in Services

```typescript
// assets/assets.service.ts
@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: {
    skip?: number;
    take?: number;
    where?: Prisma.AssetWhereInput;
    orderBy?: Prisma.AssetOrderByWithRelationInput;
  }) {
    return this.prisma.asset.findMany({
      ...options,
      include: {
        category: true,
        items: true,
      },
    });
  }

  async create(data: CreateAssetDto, userId: string) {
    return this.prisma.asset.create({
      data: {
        ...data,
        createdBy: { connect: { id: userId } },
      },
    });
  }
}
```

## Schema Design Principles

1. **Use `cuid()` for IDs**: Collision-resistant, sortable

```prisma
id String @id @default(cuid())
```

2. **Always include timestamps**:

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

3. **Use enums untuk status fields**:

```prisma
enum AssetStatus {
    ACTIVE
    INACTIVE
    MAINTENANCE
    DISPOSED
}
```

4. **Index foreign keys dan frequently queried fields**:

```prisma
@@index([categoryId])
@@index([status])
@@index([createdAt])
```

5. **Soft deletes untuk data penting**:

```prisma
deletedAt DateTime?
isDeleted Boolean @default(false)
```

## Referensi

- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Prisma Recipe](https://docs.nestjs.com/recipes/prisma)
- [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md)
