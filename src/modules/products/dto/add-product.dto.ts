import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsOptional
} from "class-validator";

export class AddProductDto {

  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 129999.99 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 'Latest Apple flagship smartphone' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity!: number;

  @ApiProperty({
    example: '["Fast charging","Water resistant"]',
    description: 'Product features'
  })
  @IsString()
  features!: string;

  @ApiProperty({
    example: '{"ram":"8GB","storage":"256GB"}',
    description: 'Specifications'
  })
  @IsString()
  specifications!: string;

  @ApiProperty({
    example: '{"brand":"Apple","warranty":"1 year"}'
  })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}