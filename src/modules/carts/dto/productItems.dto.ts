import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { Product } from "src/modules/products/entities/product.entity";

export class ProductItemsDto {
    @ApiProperty({ example: '1', description: "Product ID" })
    @IsInt()
    @IsNotEmpty()
    product!: Product

    @ApiProperty({ example: 2, description: "Quantity" })
    @IsInt()
    @IsNotEmpty()
    quantity!: number
}