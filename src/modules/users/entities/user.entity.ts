// src/users/user.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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

    @CreateDateColumn()
    createdAt!: Date;
}
