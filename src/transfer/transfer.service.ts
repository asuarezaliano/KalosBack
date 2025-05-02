import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Transfer, Prisma } from '@prisma/client';
import { PaginationReturnDto } from '../common/dto/pagination-return.dto';
import { AnalyticsGateway } from '../analytics/analytics.gateway';

@Injectable()
export class TransferService {
  constructor(
    private prisma: PrismaService,
    private analyticsGateway: AnalyticsGateway,
  ) { }

  async create(createTransferDto: CreateTransferDto): Promise<Transfer> {
    try {
      const transfer = await this.prisma.transfer.create({
        data: {
          customerName: createTransferDto.customerName,
          amount: createTransferDto.amount,
          currency: createTransferDto.currency,
        },
      });

      await this.analyticsGateway.updateAnalytics(transfer);

      return transfer;
    } catch (error) {
      throw new InternalServerErrorException(`Error creating transfer`);
    }
  }

  async findAll(filterTransferDto: FilterTransferDto): Promise<PaginationReturnDto<Transfer>> {
    const { page, limit, customerName } = filterTransferDto;
    const skip = (page - 1) * limit;

    try {
      const where: Prisma.TransferWhereInput = {};

      if (customerName) {
        where.customerName = {
          contains: customerName
        };
      }

      const [transfers, total] = await Promise.all([
        this.prisma.transfer.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          }
        }),
        this.prisma.transfer.count({ where })
      ]);

      return {
        data: transfers,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching transfers');
    }
  }
}
