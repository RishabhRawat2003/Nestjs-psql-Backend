import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";
import { Product } from "src/modules/products/entities/product.entity";

export class OrderItemDto {
  @ApiProperty({ example: 1, description: "Product ID" })
  @IsInt()
  @IsNotEmpty()
  product!: Product;

  @ApiProperty({ example: 2, description: "Quantity" })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 499.99, description: "Price snapshot" })
  @IsNumber()
  price!: number;
}
