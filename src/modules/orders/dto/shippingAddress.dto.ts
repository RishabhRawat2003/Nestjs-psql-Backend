import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class ShippingAddressDto {
  @ApiProperty({ example: "John Doe", description: "Full name of the user" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "9876543210", description: "Phone number of the user" })
  @IsString()
  @Length(10, 15)
  phone!: string;

  @ApiProperty({ example: "123 Main St", description: "Street address of the user" })
  @IsString()
  @IsNotEmpty()
  street!: string;

  @ApiProperty({ example: "New York", description: "City of the user" })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: "NY", description: "State of the user" })
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiProperty({ example: "10001", description: "Pincode of the user" })
  @IsString()
  @Length(4, 10)
  pincode!: string;
}
