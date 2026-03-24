import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./entities/cart.entity";
import { ProductItems } from "./entities/productItems.entity";
import { User } from "../users/entities/user.entity";
import { Product } from "../products/entities/product.entity";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { RedisModule } from "src/redis/redis.module";


@Module({
    imports: [TypeOrmModule.forFeature([Cart, ProductItems, User, Product]), RedisModule],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService]
})

export class CartModule { }