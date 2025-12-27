# ADR 002: Penggunaan Prisma sebagai ORM

- **Status**: Diterima
- **Tanggal**: 2025-01-15
- **Konteks**: Backend memerlukan ORM untuk interaksi dengan database PostgreSQL

## Konteks

Aplikasi memerlukan ORM (Object-Relational Mapping) untuk:
- Type-safe database queries
- Migration management
- Schema definition sebagai single source of truth
- Developer experience yang baik

Alternatif yang dipertimbangkan:
1. **TypeORM**: ORM populer untuk TypeScript, tetapi memiliki kompleksitas tinggi dan performance issues pada query kompleks
2. **Prisma**: ORM generasi baru dengan type-safety yang kuat dan developer experience yang excellent
3. **Raw SQL dengan pg**: Fleksibel tetapi tidak type-safe dan memerlukan lebih banyak boilerplate

## Keputusan

Kami memutuskan untuk menggunakan **Prisma** sebagai ORM untuk backend.

## Konsekuensi

### Keuntungan (Positif)

- **Type Safety**: Prisma generate TypeScript types dari schema, memberikan autocompletion dan compile-time error checking
- **Migration Management**: Prisma Migrate menyediakan version control untuk database schema
- **Developer Experience**: 
  - Prisma Studio untuk visual database browser
  - Auto-completion di IDE
  - Query builder yang intuitif
- **Performance**: Query optimization dan connection pooling built-in
- **Schema as Code**: `schema.prisma` sebagai single source of truth untuk database structure
- **Ecosystem**: Integrasi baik dengan NestJS dan TypeScript

### Kerugian (Negatif)

- **Learning Curve**: Developer perlu belajar Prisma query syntax (meskipun relatif mudah)
- **Less Flexibility**: Beberapa query kompleks mungkin lebih sulit dibandingkan raw SQL
- **Migration Complexity**: Complex migrations mungkin memerlukan manual SQL

## Implementasi

### Schema Definition

File `backend/prisma/schema.prisma` mendefinisikan semua model database.

### Migration Workflow

```bash
# Development
npx prisma migrate dev --name migration_name

# Production
npx prisma migrate deploy
```

### Best Practices

1. **Selalu gunakan Prisma Client** untuk queries, hindari `$queryRaw` kecuali benar-benar diperlukan
2. **Gunakan transactions** untuk operasi multi-step
3. **Index optimization** didefinisikan di schema.prisma
4. **Soft delete** menggunakan `deletedAt` field

---

**Related ADRs**: [ADR 001: Use NestJS](./001-use-nestjs-for-backend.md)

