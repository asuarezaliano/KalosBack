import { Module } from '@nestjs/common';
import { AnalyticsGateway } from './analytics.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [AnalyticsGateway],
    exports: [AnalyticsGateway],
})
export class AnalyticsModule { } 