import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { CreateOrderResponseDto } from './dto/create-order-res.dto';
import { Request } from 'express';
import { UpdateOrderDto } from './dto/update-order-req.dto';
import { UpdateOrderResponseDto } from './dto/update-order-res.dto';
import { DeleteOrderResponseDto } from './dto/delete-order-res.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Admin } from 'src/models/Admin/Admin.model';
import { Order } from 'src/models/Order/Order.model';

@Controller()
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
  ): Promise<CreateOrderResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.orderService.createOrder(createOrderDto, userId);
  }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getOrders(
    @Req() request: Request,
    @Query() query?: PaginationQueryDto,
  ): Promise<{ orders: Order[], total: number, statusCode: number }> {
    const { id: userId } = request.user as Admin;
    return await this.orderService.getOrderList(userId, query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<{ order: Order, statusCode: number }> {
    const { id: userId } = request.user as Admin;
    return await this.orderService.getOrderById(id, userId);
  }

  @Put('/edit/:id')
  @HttpCode(HttpStatus.OK)
  async editOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() request: Request,
  ): Promise<UpdateOrderResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.orderService.updateOrder(id, updateOrderDto, userId);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteOrder(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<DeleteOrderResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.orderService.deleteOrder(id, userId);
  }
}
