import { Module } from '@nestjs/common';
import { TransferModule } from './transfer/transfer.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TransferModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
