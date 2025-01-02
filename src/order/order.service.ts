import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order-dto';
import { GetTopOrdersDTO } from './dto/get-top-orders.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderRepository } from './order.repository';
import { Inject } from '@nestjs/common';
import { createCache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from 'src/notification/notification.service';


const memoryCache = createCache({
  ttl: 300,
})

@Injectable()
export class OrderService {


  constructor(
    private readonly orderRepository: OrderRepository,
    private prismaService: PrismaService,
    private configService: ConfigService,
    private notificationService: NotificationService,
  ) {}

  async create(orderData: CreateOrderDTO) { 
    const newOrder = await this.prismaService.order.create({
      data: {
        customerId: orderData.customerId,
        items: {
          create: orderData.items.map((item) => ({
            quantity: item.quantity,
            productId: item.productId,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const notificationTitle = 'New order is created';
    const notificationMessage = `Order #${newOrder.id} has been created for customer ID ${newOrder.customerId}.`;
    await this.notificationService.sendNotification(
      notificationTitle,
      notificationMessage,
    );
    return newOrder;
  }


  async getTopOrders(getTopOrdersDto: GetTopOrdersDTO) {
    const { city } = getTopOrdersDto;

    const cacheKey = `top-10-${city}`
    const result = await memoryCache.get(cacheKey);
    if (result) return result;

    const topProducts = await this.prismaService.product.findMany({
      where: {
        area: city,
        orders: {
          some: {},
        },
      },
      select: {
        name: true,
      },
      orderBy: {
        orders: {
          _count: 'desc',
        },
      },
      take: this.configService.get('TOP_ORDERS_TAKE'),
    });

    const productArray = topProducts.map((product) => product.name);
    await memoryCache.set(cacheKey, productArray);

    return productArray;
  }
}
