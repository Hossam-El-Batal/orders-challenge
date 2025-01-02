import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { OrderRepository } from './order.repository';
import { NotificationService } from 'src/notification/notification.service';

describe('OrderService', () => {
  let orderService: OrderService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(10),
  };

  const mockNotificationService = {
    sendNotification: jest.fn(),
  };

  const mockCreateOrderDTO = {
    customerId: 1,
    items: [{ productId: 1, quantity: 2 }],
  };

  const mockGetTopOrdersDTO = { city: 'Giza' };

  const mockTopProducts = [
    {
      id: 1,
      name: 'Product 1',
      category: 'Category 1',
      area: 'Haram',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Product 2',
      category: 'Category 2',
      area: 'Faisal',
      createdAt: new Date(),
    },
    {
      id: 3,
      name: 'Product 3',
      category: 'Category 3',
      area: 'Maadi',
      createdAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: OrderRepository, useValue: {} },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create an order', async () => {
      const mockOrder = {
        id: 1,
        customerId: 1,
        items: [{ productId: 1, quantity: 2 }],
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.order, 'create').mockResolvedValue(mockOrder);

      const result = await orderService.create(mockCreateOrderDTO);

      expect(result).toEqual(mockOrder);
      expect(prismaService.order.create).toHaveBeenCalledWith({
        data: {
          customerId: mockCreateOrderDTO.customerId,
          items: {
            create: mockCreateOrderDTO.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: { include: { product: { select: { name: true } } } },
        },
      });
      expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
        'New order is created',
        `Order #${mockOrder.id} has been created for customer ID ${mockOrder.customerId}.`
      );
    });
  });

  describe('getTopOrders', () => {
    it('should return top products for the given city', async () => {
      jest
        .spyOn(prismaService.product, 'findMany')
        .mockResolvedValue(mockTopProducts);

      const mockGetTopOrdersDTO = { city: 'Giza' };

      const result = await orderService.getTopOrders(mockGetTopOrdersDTO);

      expect(result).toEqual(mockTopProducts.map((product) => product.name));
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          area: mockGetTopOrdersDTO.city,
          orders: { some: {} },
        },
        select: { name: true },
        orderBy: { orders: { _count: 'desc' } },
        take: 10,
      });
    });
  });
});
