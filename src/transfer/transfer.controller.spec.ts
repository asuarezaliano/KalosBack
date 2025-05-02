import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { Currency } from '@prisma/client';

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    it('should create a transfer', async () => {
      mockTransferService.create.mockResolvedValue(mockTransfer);

      const result = await controller.create(createTransferDto);

      expect(result).toBe(mockTransfer);
      expect(transferService.create).toHaveBeenCalledWith(createTransferDto);
    });
  });

});
