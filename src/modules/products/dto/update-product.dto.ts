import { PartialType } from '@nestjs/mapped-types';
import { AddProductDto } from './add-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(AddProductDto) {
  @ApiProperty({ example: '["img1.jpg", "img2.jpg"]', description: 'Existing images' })
  existingImages?: string;   // JSON string

  @ApiProperty({ example: '["video1.mp4", "video2.mp4"]', description: 'Existing videos' })
  existingVideos?: string;   // JSON string
}

