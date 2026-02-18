import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { AddProductDto } from "./dto/add-product.dto";
import { checkIfProductNameExists, uploadOnCloudinary } from "src/common/utils/helper";
import { UpdateProductDto } from "./dto/update-product.dto";


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    async addProduct(data: AddProductDto, files?: { images?: Express.Multer.File[], videos?: Express.Multer.File[] }): Promise<Product> {
        const productNameExists = await checkIfProductNameExists(this.productRepo, data.name);

        if (productNameExists) {
            throw new ConflictException('Product name already exists');
        }


        let images: string[] = [];
        let videos: string[] = [];

        if (files?.images?.length) {
            images = await Promise.all(
                files.images.map(async (file: Express.Multer.File) => {
                    const result = await uploadOnCloudinary(file.buffer) as { secure_url: string };
                    return result.secure_url;
                })
            );
        }

        if (files?.videos?.length) {
            videos = await Promise.all(
                files.videos.map(async (file: Express.Multer.File) => {
                    const result = await uploadOnCloudinary(file.buffer) as { secure_url: string };
                    return result.secure_url;
                })
            );
        }

        const newData = {
            ...data,
            images,
            videos,
            specifications: JSON.parse(data.specifications),
            additionalInfo: JSON.parse(data.additionalInfo),
            features: JSON.parse(data.features)
        }

        return this.productRepo.save(newData);
    }


    async getAllProducts(): Promise<Product[]> {
        return this.productRepo.find();
    }

    async getSingleProduct(id: number): Promise<Product | null> {
        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

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

        if (files?.images?.length) {
            newImages = await Promise.all(
                files.images.map(async (file: Express.Multer.File) => {
                    const result = await uploadOnCloudinary(file.buffer) as { secure_url: string };
                    return result.secure_url;
                })
            );
        }

        if (files?.videos?.length) {
            newVideos = await Promise.all(
                files.videos.map(async (file: Express.Multer.File) => {
                    const result = await uploadOnCloudinary(file.buffer) as { secure_url: string };
                    return result.secure_url;
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

        return this.productRepo.update(id, newData);
    }


    // add here later before deleting product check if its id is used in another table
    async deleteProduct(id: number): Promise<void> {1
        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await this.productRepo.delete(id);
    }

}