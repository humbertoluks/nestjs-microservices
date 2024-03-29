import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class CheckoutItemDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  product_id: number;
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}

export class CreateCheckoutDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
