import { OrderStatus, PaymentMethod } from "src/common/utils/enum";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./orderItems.entity";


@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true })
    orderNum!: string

    @ManyToOne(() => User, (user) => user.orders, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @OneToMany(() => OrderItem, item => item.order, { cascade: true })
    items!: OrderItem[];

    @Column("decimal", { precision: 10, scale: 2 })
    totalAmount!: number

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status!: OrderStatus

    @Column("jsonb")
    shippingAddress!: {
        name: string;
        phone: string;
        street: string;
        city: string;
        state: string;
        pincode: string;
    }

    @Column({ type: "enum", enum: PaymentMethod, default: PaymentMethod.CASH })
    paymentMethod!: PaymentMethod

    @CreateDateColumn()
    createdAt!: Date
}