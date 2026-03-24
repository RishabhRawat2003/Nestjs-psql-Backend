import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { RedisModule } from "src/redis/redis.module";


@Module({
    imports: [TypeOrmModule.forFeature([Product]), RedisModule],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService]
})

export class ProductsModule {}