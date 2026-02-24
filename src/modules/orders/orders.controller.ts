import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { OrderDto } from "./dto/order.dto";


@ApiTags("orders")
@Controller("orders")
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post("create-order")
    @ApiOperation({ summary: "create order" })
    async createOrder(@Body() data: OrderDto) {
        return this.ordersService.createOrder(data);
    }

    @Get("get-all-orders")
    @ApiOperation({ summary: "get all orders" })
    async getAllOrders() {
        return this.ordersService.getAllOrders();
    }

    @Get("get-single-order/:id")
    @ApiOperation({ summary: "get single order" })
    @ApiParam({ name: "id", type: "number" })
    async getSingleOrder(@Param("id") id: number) {
        return this.ordersService.getSingleOrder(id);
    }


    @Delete("remove-order/:id")
    @ApiOperation({ summary: "remove order" })
    @ApiParam({ name: "id", type: "number" })
    async removeOrder(@Param("id") id: number) {
        return this.ordersService.deleteOrder(id);
    }

    @Post("update-order/:id")
    @ApiOperation({ summary: "update order" })
    @ApiParam({ name: "id", type: "number" })
    async updateOrder(@Param("id") id: number,@Body() data: OrderDto) {
        return this.ordersService.updateOrder(id, data);
    }
}