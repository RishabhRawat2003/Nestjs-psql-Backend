import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { createCartDto } from './dto/createCart.dto';
import { ProductItems } from './entities/productItems.entity';


@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepo: Repository<Cart>,

        @InjectRepository(ProductItems)
        private readonly productItemsRepo: Repository<ProductItems>,
    ) { }

    async createOrUpdateCart(userId: number, cartData: createCartDto): Promise<Cart | null> {

        let cart = await this.cartRepo.findOne({
            where: { user: { id: userId } },
            relations: ["products", "products.product"]
        });

        // create cart if not exists
        if (!cart) {
            cart = this.cartRepo.create({
                user: { id: userId }
            });
            cart = await this.cartRepo.save(cart);
        }

        const { product, quantity } = cartData.products[0];

        // check if product already in cart
        let cartItem = await this.productItemsRepo.findOne({
            where: {
                cart: { id: cart.id },
                product: { id: product } as any
            },
            relations: ["product"]
        });

        if (cartItem) {
            // increase quantity
            cartItem.quantity += quantity;
            await this.productItemsRepo.save(cartItem);
        } else {
            // add new product to cart
            cartItem = this.productItemsRepo.create({
                cart: { id: cart.id },
                product: { id: product } as any,
                quantity
            });

            await this.productItemsRepo.save(cartItem);
        }

        return this.cartRepo.findOne({
            where: { id: cart.id },
            relations: ["products", "products.product"]
        });
    }

    async getCartByUserId(userId: number): Promise<Cart | null | string> {
        const cart = await this.cartRepo.findOne({
            where: { user: { id: userId } },
            relations: {
                products: {
                    product: true,
                },
                user: true
            },
            select: {
                id: true,
                user: {
                    id: true,
                    name: true,
                },
                products: {
                    id: true,
                    quantity: true,
                    product: {
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                        quantity: true
                    }
                }
            }
        });

        if (!cart) return "Cart not found";

        return cart;
    }

    async clearCart(userId: number): Promise<Cart | null> {
        const cart = await this.cartRepo.findOne({
            where: { user: { id: userId } },
            relations: ['products']
        });

        if (!cart) return null;

        await this.productItemsRepo.delete({
            cart: { id: cart.id }
        });

        return cart;
    }


    async removeItemFromCart(userId: number, itemId: number): Promise<Cart | null> {
        const cart = await this.cartRepo.findOne({
            where: { user: { id: userId } }
        });

        if (!cart) return null;

        await this.productItemsRepo.delete({
            id: itemId
        });

        return this.cartRepo.findOne({
            where: { id: cart.id },
            relations: ['products', 'products.product']
        });
    }

}