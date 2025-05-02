import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';
import { Currency, Transfer } from '@prisma/client';
import { PaginationReturnDto } from '../common/dto/pagination-return.dto';

describe('TransferController', () => {
  let controller: TransferController;
  let transferService: TransferService;

  const mockTransferService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        {
          provide: TransferService,
          useValue: mockTransferService,
        },
      ],
    }).compile();

    controller = module.get<TransferController>(TransferController);
    transferService = module.get<TransferService>(TransferService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    it('should create a transfer', async () => {
      mockTransferService.create.mockResolvedValue(mockTransfer);

      const result = await controller.create(createTransferDto);

      expect(result).toBe(mockTransfer);
      expect(transferService.create).toHaveBeenCalledWith(createTransferDto);
    });
  });

  describe('findAll', () => {
    const mockTransfer: Transfer = {
      id: '1',
      customerName: 'John Doe',
      amount: 100,
      currency: Currency.USD,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockPaginatedResponse: PaginationReturnDto<Transfer> = {
      data: [mockTransfer],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };

    it('should return paginated transfers without filters', async () => {
      const filterDto: FilterTransferDto = {
        page: 1,
        limit: 10,
      };

      mockTransferService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(filterDto);

      expect(result).toBe(mockPaginatedResponse);
      expect(transferService.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should return filtered transfers when customerName is provided', async () => {
      const filterDto: FilterTransferDto = {
        page: 1,
        limit: 10,
        customerName: 'John',
      };

      const filteredResponse: PaginationReturnDto<Transfer> = {
        ...mockPaginatedResponse,
        data: mockPaginatedResponse.data.filter(t => t.customerName.includes('John')),
      };

      mockTransferService.findAll.mockResolvedValue(filteredResponse);

      const result = await controller.findAll(filterDto);

      expect(result).toEqual(filteredResponse);
      expect(transferService.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should handle empty results', async () => {
      const filterDto: FilterTransferDto = {
        page: 1,
        limit: 10,
        customerName: 'NonExistent',
      };

      const emptyResponse: PaginationReturnDto<Transfer> = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      mockTransferService.findAll.mockResolvedValue(emptyResponse);

      const result = await controller.findAll(filterDto);

      expect(result).toEqual(emptyResponse);
      expect(transferService.findAll).toHaveBeenCalledWith(filterDto);
    });
  });
});
