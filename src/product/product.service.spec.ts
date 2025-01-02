import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ProductService } from './product.service';
import { ConfigService } from '@nestjs/config';
import { ProductRepository } from './product.repository';

describe('ProductService', () => {
  let productService: ProductService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    product: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(10),
  };

  const mockProductRepository = {
  };

  const mockGetAllProductsDTO = {
    categories: ['electronics'],
    pageNumber: 1,
    pageSize: 10,
  };

  const mockProductList = [
    {
      id: 1,
      name: 'Product 1',
      category: 'Category A',
      area: 'Area 1',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Product 2',
      category: 'Category B',
      area: 'Area 2',
      createdAt: new Date(),
    },
  ];

  const mockTotalCount = 2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: ProductRepository, useValue: mockProductRepository },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getAllProducts', () => {
    it('should return products with pagination and filters', async () => {
      jest.spyOn(prismaService.product, 'count').mockResolvedValue(mockTotalCount);
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(mockProductList);

      const result = await productService.getAllProducts(mockGetAllProductsDTO);

      expect(prismaService.product.count).toHaveBeenCalledWith({
        where: { category: { in: mockGetAllProductsDTO.categories } },
      });

      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: { category: { in: mockGetAllProductsDTO.categories } },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        products: mockProductList,
        totalCount: mockTotalCount,
      });
    });

    it('should handle missing pageNumber and pageSize', async () => {
      const mockFiltersWithoutPagination = { categories: ['electronics'] };

      jest.spyOn(prismaService.product, 'count').mockResolvedValue(mockTotalCount);
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(mockProductList);

      const result = await productService.getAllProducts(
        mockFiltersWithoutPagination as any,
      );

      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: { category: { in: mockFiltersWithoutPagination.categories } },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        products: mockProductList,
        totalCount: mockTotalCount,
      });
    });
  });
});
