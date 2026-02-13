import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address of the user' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Password must be at least 6 characters' })
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png', description: 'Profile image URL' })
  @IsString()
  @IsOptional()
  image!: string;
}
