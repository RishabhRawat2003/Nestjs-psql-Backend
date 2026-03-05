import { Product } from "src/modules/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity()
export class ProductItems {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Product)
    product!: Product

    @ManyToOne(() => Cart, cart => cart.products, { onDelete: "CASCADE" })
    cart!: Cart

    @Column()
    quantity!: number

}