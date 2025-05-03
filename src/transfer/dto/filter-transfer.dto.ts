import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterTransferDto extends PaginationDto {
    @IsOptional()
    @IsString()
    customerName?: string;
} 