import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { OrderItem } from "./entities/orderItems.entity";
import { Product } from "../products/entities/product.entity";
import { SocketModule } from "src/socket/socket.module";


@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderItem, Product]), SocketModule],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService]
})

export class OrdersModule {}