import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, ValidateNested } from "class-validator";
import { ProductItemsDto } from "./productItems.dto";
import { Type } from "class-transformer";
import { User } from "src/modules/users/entities/user.entity";

export class createCartDto {
    @ApiProperty({ type: [ProductItemsDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductItemsDto)
    products!: ProductItemsDto[]
}