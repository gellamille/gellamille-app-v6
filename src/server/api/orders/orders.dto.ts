import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

const orderStatuses = [
  'draft',
  'submitted',
  'approved',
  'stock_shortage',
  'allocating',
  'shipment_created',
  'shipped',
  'rejected',
  'void',
] as const;

export class ListOrdersQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(orderStatuses)
  status?: (typeof orderStatuses)[number];
}

export class TransitionOrderDto {
  @IsIn(['approved', 'stock_shortage', 'allocating'])
  targetStatus!: 'approved' | 'stock_shortage' | 'allocating';
}

export class RejectOrderDto {
  @IsString()
  @Length(5, 500)
  reason!: string;
}

export class VoidOrderDto {
  @IsString()
  @Length(5, 500)
  reason!: string;
}
