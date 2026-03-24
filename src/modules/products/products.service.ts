import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { AddProductDto } from "./dto/add-product.dto";
import { checkIfProductNameExists, uploadOnCloudinary, uploadToS3 } from "src/common/utils/helper";
import { UpdateProductDto } from "./dto/update-product.dto";
import { RedisService } from "src/redis/redis.service";


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,

        private readonly redisService: RedisService,

    ) { }

    async addProduct(data: AddProductDto, files?: { images?: Express.Multer.File[], videos?: Express.Multer.File[] }): Promise<Product> {
        const productNameExists = await checkIfProductNameExists(this.productRepo, data.name);

        if (productNameExists) {
            throw new ConflictException('Product name already exists');
        }


        let images: string[] = [];
        let videos: string[] = [];

        // if (files?.images?.length) {
        //     images = await Promise.all(
        //         files.images.map(async (file: Express.Multer.File) => {
        //             const result = await uploadOnCloudinary(file.buffer) as { secure_url: string };
        //             return result.secure_url;
        //         })
        //     );
        // }

        // if (files?.videos?.length) {
        //     videos = await Promise.all(
        //         files.videos.map(async (file: Express.Multer.File) => {
        //             const result = await uploadOnCloudinary(file.buffer) as { secure_url: string };
        //             return result.secure_url;
        //         })
        //     );
        // }

        if (files?.images?.length) {
            images = await Promise.all(
                files.images.map(async (file) => {
                    return await uploadToS3(file);
                })
            );
        }

        if (files?.videos?.length) {
            videos = await Promise.all(
                files.videos.map(async (file) => {
                    return await uploadToS3(file);
                })
            );
        }

        const newData = {
            ...data,
            images,
            videos,
            specifications: JSON.parse(data.specifications),
            additionalInfo: data.additionalInfo ? JSON.parse(data.additionalInfo) : null,
            features: JSON.parse(data.features)
        }

        return this.productRepo.save(newData);
    }


    async getAllProducts(): Promise<Product[]> {
        return this.productRepo.find();
    }

    async getSingleProduct(id: number): Promise<Product> {
        const cached = await this.redisService.get<Product>(`product_${id}`);

        if (cached) {
            console.log("From Redis -> Products");
            return cached;
        }

        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await this.redisService.set(`product_${id}`, product, 300);

        return product;
    }


    async updateProduct(id: number, data: UpdateProductDto, files?: { images?: Express.Multer.File[], videos?: Express.Multer.File[] }): Promise<any> {
        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        let existingImages: string[] = [];
        let existingVideos: string[] = [];
        let newImages: string[] = [];
        let newVideos: string[] = [];

        if (data.existingImages) {
            try {
                existingImages = JSON.parse(data.existingImages);
            } catch (err) {
                throw new BadRequestException('Invalid existingImages format');
            }
        }

        if (data.existingVideos) {
            try {
                existingVideos = JSON.parse(data.existingVideos);
            } catch (err) {
                throw new BadRequestException('Invalid existingVideos format');
            }
        }

        // if (files?.images?.length) {
        //     newImages = await Promise.all(
        //         files.images.map(async (file: Express.Multer.File) => {
        //             const result = await uploadOnCloudinary(file.buffer) as { secure_url: string };
        //             return result.secure_url;
        //         })
        //     );
        // }

        // if (files?.videos?.length) {
        //     newVideos = await Promise.all(
        //         files.videos.map(async (file: Express.Multer.File) => {
        //             const result = await uploadOnCloudinary(file.buffer) as { secure_url: string };
        //             return result.secure_url;
        //         })
        //     );
        // }

        if (files?.images?.length) {
            newImages = await Promise.all(
                files.images.map(async (file) => {
                    return await uploadToS3(file);
                })
            );
        }

        if (files?.videos?.length) {
            newVideos = await Promise.all(
                files.videos.map(async (file) => {
                    return await uploadToS3(file);
                })
            );
        }

        const newData: any = {
            ...data,
            images: [...existingImages, ...newImages],
            videos: [...existingVideos, ...newVideos],
            features: JSON.stringify(data.features),
            specifications: JSON.stringify(data.specifications),
            additionalInfo: JSON.stringify(data.additionalInfo)
        }

        await this.redisService.del(`product_${id}`);

        return this.productRepo.update(id, newData);
    }


    // add here later before deleting product check if its id is used in another table
    async deleteProduct(id: number): Promise<void> {
        1
        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await this.redisService.del(`product_${id}`);
        await this.productRepo.delete(id);
    }

}