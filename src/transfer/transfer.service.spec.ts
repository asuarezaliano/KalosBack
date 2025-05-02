import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from './transfer.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { Currency } from '@prisma/client';
import { InternalServerErrorException } from '@nestjs/common';

describe('TransferService', () => {
  let service: TransferService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    transfer: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransferService>(TransferService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTransferDto: CreateTransferDto = {
      customerName: 'John Doe',
      amount: 100,
      currency: Currency.USD,
    };

    const mockTransfer = {
      id: '1',
      customerName: 'John Doe',
      amount: 100,
      currency: Currency.USD,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a transfer successfully', async () => {
      mockPrismaService.transfer.create.mockResolvedValue(mockTransfer);

      const result = await service.create(createTransferDto);

      expect(result).toEqual(mockTransfer);
      expect(prismaService.transfer.create).toHaveBeenCalledWith({
        data: {
          customerName: createTransferDto.customerName,
          amount: createTransferDto.amount,
          currency: createTransferDto.currency,
        },
      });
    });

    it('should throw InternalServerErrorException when creation fails', async () => {
      mockPrismaService.transfer.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createTransferDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
