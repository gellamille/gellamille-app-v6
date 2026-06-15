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

export class CreateLotDto {
  @IsDateString({ strict: true })
  productionDate!: string;

  @IsIn(['AM', 'PM'])
  productionPeriod!: 'AM' | 'PM';

  @IsString()
  @Length(2, 8)
  flavorCode!: string;

  @Transform(({ value }) => Number(value))
  @IsIn([150, 300])
  sizeMl!: 150 | 300;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  quantity!: number;

  @IsString()
  operatorId!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  note?: string;
}

export class VoidLotDto {
  @IsString()
  @Length(5, 500)
  reason!: string;
}

export class ListLotsQueryDto {
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
  @IsIn(['active', 'void'])
  status?: 'active' | 'void';

  @IsOptional()
  @IsString()
  flavorCode?: string;

  @IsOptional()
  @IsDateString({ strict: true })
  from?: string;

  @IsOptional()
  @IsDateString({ strict: true })
  to?: string;
}
