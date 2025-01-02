import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order-dto';
import { GetTopOrdersDTO } from './dto/get-top-orders.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() data: CreateOrderDTO) {
    return this.orderService.create(data)
  }

  @Get()
  async getTopOrders(@Query() getTopOrdersDto: GetTopOrdersDTO) {
    return this.orderService.getTopOrders(getTopOrdersDto)
  }
}
