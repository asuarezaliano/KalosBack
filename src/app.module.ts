import { Module } from '@nestjs/common';
import { TransferModule } from './transfer/transfer.module';
import { PrismaModule } from './prisma/prisma.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [TransferModule, PrismaModule, AnalyticsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
