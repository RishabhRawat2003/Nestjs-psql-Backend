import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CartService } from "./cart.service";
import { createCartDto } from "./dto/createCart.dto";


@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) { }

    @Post("/add-to-cart/:id")
    @ApiOperation({ summary: 'Add product to cart' })
    @ApiParam({ name: 'id', type: 'number' , description: 'User id'})
    async addToCart(@Param("id", ParseIntPipe) id: number, @Body() data: createCartDto) {
        return this.cartService.createOrUpdateCart(id, data);
    }

    @Get("/get-cart/:id")
    @ApiOperation({ summary: 'Get cart by user id' })
    @ApiParam({ name: 'id', type: 'number', description: 'User id' })
    async getCart(@Param("id", ParseIntPipe) id: number) {
        return this.cartService.getCartByUserId(id);
    }

    @Post("/clear-cart/:id")
    @ApiOperation({ summary: 'Clear cart by user id' })
    @ApiParam({ name: 'id', type: 'number' , description: 'User id'})
    async clearCart(@Param("id", ParseIntPipe) id: number) {
        return this.cartService.clearCart(id);
    }

    @Post("/remove-item/:id")
    @ApiOperation({ summary: "Remove item from cart by user id and item id" })
    @ApiParam({ name: "id", type: "number" , description: "User id"})
    async removeItem(@Param("id", ParseIntPipe) id: number, @Body() data: { itemId: number }) {
        return this.cartService.removeItemFromCart(id, data.itemId);
    }
}