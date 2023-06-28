import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  /**
   * Create a new user
   * @param name
   * @param description
   */
  async create(name: string, description: string): Promise<Product> {
    const createdProduct = new this.productModel({ name, description });
    return createdProduct.save();
  }

  /**
   * Find all users
   */
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findById(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async update(
    id: string,
    name: string,
    description: string,
  ): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(id, { name, description }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Product> {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
