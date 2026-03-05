import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from "class-validator";

export class UpdateProductDto {

  @ApiPropertyOptional({ example: 'iPhone 15 Pro', description: 'Name of the product' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 129999.99, description: 'Price of the product' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 'Latest Apple flagship smartphone' })
  @IsOptional()
  @IsString()
  description?: string;

  // Existing images from frontend (to keep old images)
  @ApiPropertyOptional({
    example: '["img1.jpg","img2.jpg"]',
    description: 'Existing images to keep'
  })
  @IsOptional()
  @IsString()
  existingImages?: string;

  // Existing videos from frontend
  @ApiPropertyOptional({
    example: '["video1.mp4"]',
    description: 'Existing videos to keep'
  })
  @IsOptional()
  @IsString()
  existingVideos?: string;

  @ApiPropertyOptional({ example: 50, description: 'Available quantity' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    example: '["Fast charging","Water resistant"]',
    description: 'Product features'
  })
  @IsOptional()
  @IsString()
  features?: string;

  @ApiPropertyOptional({
    example: '{"ram":"8GB","storage":"256GB"}',
    description: 'Product specifications'
  })
  @IsOptional()
  @IsString()
  specifications?: string;

  @ApiPropertyOptional({
    example: '{"brand":"Apple","warranty":"1 year"}',
    description: 'Additional product info'
  })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}