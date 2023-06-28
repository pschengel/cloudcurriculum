import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body('name') name: string,
    @Body('description') description: string,
  ) {
    const generatedId = await this.productsService.create(name, description);
    return { id: generatedId };
  }

  @Get()
  async findAll(): Promise<any> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    return this.productsService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('description') description: string,
  ) {
    const updatedProduct = await this.productsService.update(
      id,
      name,
      description,
    );
    return { id: updatedProduct.id };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.productsService.delete(id);
    return { message: 'Product deleted successfully' };
  }
}
