import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';
import { Transfer } from '@prisma/client';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) { }

  @Post()
  create(@Body() createTransferDto: CreateTransferDto): Promise<Transfer> {
    return this.transferService.create(createTransferDto);
  }

  @Get()
  findAll(@Query() filterTransferDto: FilterTransferDto) {
    return this.transferService.findAll(filterTransferDto);
  }
}