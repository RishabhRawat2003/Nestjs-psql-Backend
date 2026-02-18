import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min
} from "class-validator";

export class AddProductDto {

  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 129999.99, description: 'Price of the product' })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 'Latest Apple flagship smartphone', description: 'Product description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: ['img1.jpg', 'img2.jpg'],
    description: 'Product images',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @ApiProperty({
    example: ['video1.mp4'],
    description: 'Product videos',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  videos!: string[];

  @ApiProperty({ example: 50, description: 'Available quantity' })
  @IsNumber()
  @Min(0)
  quantity!: number;

  @ApiProperty({
    example: ['Fast charging', 'Water resistant', 'Face ID'],
    description: 'Product features',
    type: [String],
  })
  features!: string;

  @ApiProperty({
    example: {
      ram: '8GB',
      storage: '256GB',
      battery: '4500mAh',
      camera: '48MP'
    },
    description: 'Product specifications',
  })
  specifications!: string;

  @ApiProperty({
    example: {
      warranty: '1 year',
      brand: 'Apple',
      country: 'USA'
    },
    description: 'Additional product info'
  })
  additionalInfo!: string;
}
