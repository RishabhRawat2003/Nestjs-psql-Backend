import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RedisModule } from './redis/redis.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { CartModule } from './modules/carts/cart.module';
import { HealthModule } from './health/health.module';
import { getEnvFilePath } from './common/utils/helper';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: getEnvFilePath(), }),
    DatabaseModule, // ❗ database
    UsersModule, // ❗ users
    ProductsModule, // ❗ products
    OrdersModule, // ❗ orders
    RedisModule, // ❗ redis
    RabbitMQModule, // ❗ rabbitmq,
    CartModule,  // ❗ cart
    HealthModule, // ❗ health
  ],
})
export class AppModule { }
