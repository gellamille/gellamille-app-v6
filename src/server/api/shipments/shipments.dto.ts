import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateShipmentDto {
  @IsString()
  partnerId!: string;

  @IsDateString({ strict: true })
  shipmentDate!: string;

  @IsOptional() @IsString() @Length(0, 500)
  shippingAddress?: string;

  @IsOptional() @IsString() @Length(0, 100)
  customerOrderNumber?: string;

  @IsOptional() @IsString() @Length(0, 100)
  deliveryNoteNumber?: string;

  @IsOptional() @IsString() @Length(0, 1000)
  note?: string;
}

export class SetShipmentItemDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class TransitionShipmentDto {
  @IsIn(['closed', 'shipped'])
  targetStatus!: 'closed' | 'shipped';
}

export class VoidShipmentDto {
  @IsString()
  @Length(5, 500)
  reason!: string;
}

export class ListShipmentsQueryDto {
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

  @IsOptional() @IsString()
  q?: string;

  @IsOptional()
  @IsIn(['draft', 'closed', 'shipped', 'void'])
  status?: 'draft' | 'closed' | 'shipped' | 'void';
}
