import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TransferModule } from './transfer/transfer.module';

@Module({
  imports: [TransferModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
