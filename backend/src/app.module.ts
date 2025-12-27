import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/prisma/prisma.module';
import { HealthModule } from './health/health.module';
// import { AuthModule } from './auth/auth.module';
// import { AssetsModule } from './assets/assets.module';
// import { UsersModule } from './users/users.module';
// import { RequestsModule } from './requests/requests.module';
// import { TransactionsModule } from './transactions/transactions.module';
// import { CustomersModule } from './customers/customers.module';
// import { MaintenanceModule } from './maintenance/maintenance.module';
// import { CategoriesModule } from './categories/categories.module';
// import { DivisionsModule } from './divisions/divisions.module';
// import { NotificationsModule } from './notifications/notifications.module';

import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    // Shared modules
    PrismaModule,
    HealthModule,
    // Feature modules (uncomment as you implement them)
    // AuthModule,
    // UsersModule,
    // AssetsModule,
    // RequestsModule,
    // TransactionsModule,
    // CustomersModule,
    // MaintenanceModule,
    // CategoriesModule,
    // DivisionsModule,
    // NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
