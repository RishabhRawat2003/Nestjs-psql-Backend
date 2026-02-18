import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number

    @Column("text")
    description!: string

    @Column("text", { array: true })
    images!: string[];

    @Column("text", { array: true })
    videos!: string[];

    @Column({ default: 0 })
    quantity!: number

    @Column('text', { array: true })
    features!: string[]

    @Column('jsonb')
    specifications!: Record<string, any>

    @Column('jsonb')
    additionalInfo!: Record<string, any>

    @CreateDateColumn()
    createdAt!: Date
}