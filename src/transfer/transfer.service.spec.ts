import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from './transfer.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';
import { Currency, Transfer } from '@prisma/client';
import { InternalServerErrorException } from '@nestjs/common';
import { PaginationReturnDto } from '../common/dto/pagination-return.dto';

describe('TransferService', () => {
  let service: TransferService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    transfer: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
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

  beforeEach(() => {
    jest.clearAllMocks();
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

    const mockTransfer: Transfer = {
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

  describe('findAll', () => {
    const mockTransfers: Transfer[] = [
      {
        id: '1',
        customerName: 'John Doe',
        amount: 100,
        currency: Currency.USD,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        amount: 200,
        currency: Currency.EUR,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return paginated results without filters', async () => {
      const filterDto: FilterTransferDto = {
        page: 1,
        limit: 10,
      };

      const expectedResponse: PaginationReturnDto<Transfer> = {
        data: mockTransfers,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockPrismaService.transfer.findMany.mockResolvedValue(mockTransfers);
      mockPrismaService.transfer.count.mockResolvedValue(2);

      const result = await service.findAll(filterDto);

      expect(result).toEqual(expectedResponse);
      expect(prismaService.transfer.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should filter by customerName when provided', async () => {
      const filterDto: FilterTransferDto = {
        page: 1,
        limit: 10,
        customerName: 'John',
      };

      const filteredTransfers = [mockTransfers[0]];
      const expectedResponse: PaginationReturnDto<Transfer> = {
        data: filteredTransfers,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockPrismaService.transfer.findMany.mockResolvedValue(filteredTransfers);
      mockPrismaService.transfer.count.mockResolvedValue(1);

      const result = await service.findAll(filterDto);

      expect(result).toEqual(expectedResponse);
      expect(prismaService.transfer.findMany).toHaveBeenCalledWith({
        where: {
          customerName: {
            contains: 'John',
          },
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should handle empty results', async () => {
      const filterDto: FilterTransferDto = {
        page: 1,
        limit: 10,
        customerName: 'NonExistent',
      };

      const expectedResponse: PaginationReturnDto<Transfer> = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      mockPrismaService.transfer.findMany.mockResolvedValue([]);
      mockPrismaService.transfer.count.mockResolvedValue(0);

      const result = await service.findAll(filterDto);

      expect(result).toEqual(expectedResponse);
    });

    it('should throw InternalServerErrorException when query fails', async () => {
      const filterDto: FilterTransferDto = {
        page: 1,
        limit: 10,
      };

      mockPrismaService.transfer.findMany.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll(filterDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
