import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { ProductDTO } from './dto/product.dto';
import { ListProductDTO } from './dto/list-product.dto'
import { ConfigService } from '@nestjs/config';



@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async getAllProducts(filters: GetAllProductsDTO): Promise<ListProductDTO> {
    const { categories } = filters;
    const pageNumber =
      Number(filters.pageNumber) ||
      Number(this.configService.get('DEFAULT_PAGE_NUMBER'));
    const pageSize =
      Number(filters.pageSize) ||
      Number(this.configService.get('DEFAULT_PAGE_SIZE'));

    const categoryFilter = categories?.length
      ? { category: { in: categories } }
      : {};
    
    const totalCount = await this.prismaService.product.count({
      where: categoryFilter,
    });

    const products = await this.prismaService.product.findMany({
      where: categoryFilter,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    return {
      products,
      totalCount
    };
  }

  async getProductById(id: number): Promise<ProductDTO> {
    return this.productsRepository.findById(id);
  }
}

