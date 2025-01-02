import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [OrderController],
  providers: [PrismaService, OrderService, OrderRepository],
  imports: [NotificationModule],
})
export class OrderModule {}
