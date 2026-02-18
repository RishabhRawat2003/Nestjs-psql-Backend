import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/common/middlewares/multer";
import { AddProductDto } from "./dto/add-product.dto";



@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post('add-product')
    @ApiOperation({ summary: 'Add product' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 5 }], multerOptions))
    add(@Body() data: AddProductDto, @UploadedFiles() files?: { images?: Express.Multer.File[], videos?: Express.Multer.File[] }) {
        return this.productsService.addProduct(data, files);
    }

    @Get('all-products')
    @ApiOperation({ summary: 'Get all products' })
    getAll() {
        return this.productsService.getAllProducts();
    }

    @Get('get-product/:id')
    @ApiParam({ name: 'id', type: 'number' })
    @ApiOperation({ summary: 'Get single product' })
    getSingle(@Param('id') id: number) {
        return this.productsService.getSingleProduct(id);
    }

    @Delete('remove-product/:id')
    @ApiParam({ name: 'id', type: 'number' })
    @ApiOperation({ summary: 'Remove product' })
    remove(@Param('id') id: number) {
        return this.productsService.deleteProduct(id);
    }

    @Post('update-product/:id')
    @ApiOperation({ summary: 'Update product' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 5 }], multerOptions))
    update(@Param('id') id: number, @Body() data: AddProductDto, @UploadedFiles() files?: { images?: Express.Multer.File[], videos?: Express.Multer.File[] }) {
        return this.productsService.updateProduct(id, data, files);
    }
}