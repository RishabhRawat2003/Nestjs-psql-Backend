// src/users/user.entity.ts

import { Cart } from 'src/modules/carts/entities/cart.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    image?: string | null;

    @OneToMany(() => Order, (order) => order.user)
    orders!: Order[];

    @OneToOne(() => Cart, cart => cart.user)
    cart!: Cart;

    @CreateDateColumn()
    createdAt!: Date;
}
