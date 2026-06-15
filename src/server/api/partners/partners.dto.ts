import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
  Max,
  Min,
} from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @Length(2, 160)
  name!: string;

  @IsOptional() @IsString() @Length(0, 200)
  billingName?: string;

  @IsOptional() @IsString() @Length(0, 40)
  taxNumber?: string;

  @IsOptional() @IsString() @Length(0, 500)
  shippingAddress?: string;

  @IsOptional() @IsString() @Length(0, 160)
  contactName?: string;

  @IsOptional() @IsEmail() @Length(0, 254)
  email?: string;

  @IsOptional() @IsString() @Length(0, 50)
  phone?: string;

  @IsOptional() @IsString() @Length(0, 1000)
  note?: string;
}

export class ListPartnersQueryDto {
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
}


export class PartnerDeliveryDayInputDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(7)
  weekday!: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  @Max(30)
  cutoffBusinessDays!: number;
}

export class SetPartnerDeliveryDaysDto {
  @IsArray()
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => PartnerDeliveryDayInputDto)
  days!: PartnerDeliveryDayInputDto[];
}
