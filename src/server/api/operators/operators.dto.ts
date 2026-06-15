import { IsString, Length } from 'class-validator';

export class CreateOperatorDto {
  @IsString()
  @Length(2, 80)
  name!: string;
}
