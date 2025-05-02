import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Transfer } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransferService {
  constructor(private prisma: PrismaService) { }

  async create(createTransferDto: CreateTransferDto): Promise<Transfer> {
    try {
      return await this.prisma.transfer.create({
        data: {
          customerName: createTransferDto.customerName,
          amount: createTransferDto.amount,
          currency: createTransferDto.currency,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error al crear la transferencia`);
    }
  }

  findAll() {
    return `This action returns all transfer`;
  }
}
