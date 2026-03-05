import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductItems } from "./productItems.entity";
import { User } from "src/modules/users/entities/user.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id!: number

    @OneToMany(() => ProductItems, product => product.cart, { cascade: true, orphanedRowAction: "delete" })
    products!: ProductItems[]

    @OneToOne(() => User, user => user.cart, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    user!: User
}