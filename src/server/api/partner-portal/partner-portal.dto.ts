import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class PartnerOrderItemInputDto {
  @IsString()
  @Length(1, 30)
  productId!: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(999)
  cartons!: number;
}

export class CreatePartnerOrderDto {
  @IsDateString({ strict: true })
  requestedDeliveryDate!: string;

  @IsIn([
    'cash_on_delivery',
    'card_on_delivery',
    'bank_transfer',
  ])
  paymentMethod!:
    | 'cash_on_delivery'
    | 'card_on_delivery'
    | 'bank_transfer';

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(16)
  @ValidateNested({ each: true })
  @Type(() => PartnerOrderItemInputDto)
  items!: PartnerOrderItemInputDto[];
}
