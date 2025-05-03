import { IsNotEmpty, IsNumber, IsString, Min, IsEnum } from 'class-validator';
import { Currency } from '@prisma/client';

export class CreateTransferDto {
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    amount: number;

    @IsEnum(Currency)
    @IsNotEmpty()
    currency: Currency;

    @IsString()
    @IsNotEmpty()
    customerName: string;
}
