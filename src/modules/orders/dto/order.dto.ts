import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { OrderItemDto } from "./orderItem.dto";
import { Type } from "class-transformer";
import { OrderStatus, PaymentMethod } from "src/common/utils/enum";
import { ShippingAddressDto } from "./shippingAddress.dto";
import { User } from "src/modules/users/entities/user.entity";


export class OrderDto {
    // @ApiProperty({ example: 'ORD0001', description: 'Order number' })
    // @IsString()
    // @IsNotEmpty()
    // orderNum?: string

    @ApiProperty({ example: '1', description: 'User ID' })
    @IsInt()
    user?: User

    @ApiProperty({ type: [OrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[];

    @ApiProperty({ enum: OrderStatus})
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @ApiProperty({ enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    paymentMethod!: PaymentMethod;


    @ApiProperty({ example: "10000", description: "Total amount" })
    @IsNumber()
    totalAmount?: number

    @ApiProperty({ type: ShippingAddressDto })
    @ValidateNested()
    @Type(() => ShippingAddressDto)
    shippingAddress!: ShippingAddressDto;
}