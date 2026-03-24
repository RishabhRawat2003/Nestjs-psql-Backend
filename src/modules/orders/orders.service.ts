import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { OrderDto } from "./dto/order.dto";
import { Product } from "../products/entities/product.entity";
import { OrderStatus } from "src/common/utils/enum";
import { ProducerService } from "src/rabbitmq/producer.service";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,

        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,

        private readonly rabbitmq: ProducerService,

        private readonly redisService: RedisService
    ) { }

    async createOrder(data: OrderDto): Promise<Order> {
        const [lastOrder] = await this.orderRepo.find({
            order: { id: "DESC" },
            take: 1
        });

        let orderNum = `ORD${lastOrder ? lastOrder.id + 1 : 1}`

        const updatedData = {
            ...data,
            orderNum
        }

        return this.orderRepo.save(updatedData);
    }

    async getAllOrders(): Promise<Order[]> {
        return this.orderRepo.find({
            relations: {
                items: {
                    product: true,
                },
                user: true
            }
        });
    }

    async getSingleOrder(id: number): Promise<Order | null> {
        const cached = await this.redisService.get<Order>(`order_${id}`);

        if (cached) {
            console.log("From Redis -> Orders");
            return cached;
        }

        const order = await this.orderRepo.findOne({ where: { id }, relations: { items: { product: true }, user: true } });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        await this.redisService.set(`order_${id}`, order, 300);

        return order;
    }

    async deleteOrder(id: number): Promise<void> {
        await this.redisService.del(`order_${id}`);
        await this.orderRepo.delete(id);
    }

    async updateOrder(id: number, data: OrderDto): Promise<any> {
        // here if shipped then remove from stock and if shipped but then cancelled then add back to stock

        const order: any = await this.orderRepo.findOne({ where: { id }, relations: { items: { product: true } } });

        if (data.status === OrderStatus.SHIPPED && order.status !== OrderStatus.CANCELLED) {
            order?.items.forEach(async (item: any) => {
                let product: any = await this.productRepo.findOne({ where: { id: item.product.id } });
                product.quantity -= item.quantity;
                await this.productRepo.save(product);
            })
        }

        let allProductIds = await order?.items.map((item: any) => item.product.id);

        let dataToEmit: { ids: string[], tableName: string } = {
            ids: allProductIds,
            tableName: 'products'
        }

        this.rabbitmq.publishToQueue("task_queue", dataToEmit)

        await this.redisService.del(`order_${id}`);

        return this.orderRepo.update(id, data);
    }

}