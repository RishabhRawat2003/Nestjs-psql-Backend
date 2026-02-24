import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RedisModule } from './redis/redis.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule, // ❗ database
    UsersModule, // ❗ users
    ProductsModule, // ❗ products
    OrdersModule, // ❗ orders
    RedisModule, // ❗ redis
  ],
})
export class AppModule { }
