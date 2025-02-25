import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InvoiceRepository } from '../../repositories/invoice/invoice.repository';
import { OrderRepository } from '../../repositories/order/order.repository';
import { CreateOrderDto } from './dto/create-order-dto';
import { CreateOrderResponseDto } from './dto/create-order-res.dto';
import { Currency } from '../../common/enum/currency.enum';
import { Role } from '../../common/enum/role.enum';
import { AdminRepository } from '../../repositories/admin/admin.repository';
import { UpdateOrderDto } from './dto/update-order-req.dto';
import { UpdateOrderResponseDto } from './dto/update-order-res.dto';
import { DeleteOrderResponseDto } from './dto/delete-order-res.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CustomerRepository } from '../../repositories/customer/customer.repository';
import { CurrencyRepository } from '../../repositories/currency/currency-repository';
import { Order } from 'src/models/Order/Order.model';
import { Customer } from 'src/models/Customer/Customer.model';

@Injectable()
export class OrderService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly orderRepository: OrderRepository,
    private readonly adminRepository: AdminRepository,
    private readonly currencyRepository: CurrencyRepository,
  ) {}

  private readonly conversionRates = {
    [Currency.MOP]: 0.96,
    [Currency.HKD]: 1.03,
    [Currency.CNY]: 0.87,
  };

  async createOrder(
    orderData: CreateOrderDto,
    userId: string,
  ): Promise<CreateOrderResponseDto> {
    try {
      const { currency, amountOfDelivery, invoiceNumber } = orderData;

      const invoiceDetails = await this.invoiceRepository.findOneByClause({
        where: { invoiceNumber },
      });

      if (invoiceDetails === null) {
        throw new NotFoundException('Invalid invoice details');
      }

      const customerDetails = await this.customerRepository.findById(
        orderData.customerId,
      );

      if (!customerDetails) {
        throw new NotFoundException('Invalid customer details');
      }

      if (!this.conversionRates[currency]) {
        throw new InternalServerErrorException(
          `Unsupported currency: ${currency}`,
        );
      }

      const currencyDetails = await this.currencyRepository.findOneByClause({
        where: { baseCurrency: Currency.HKD },
      });

      if (!currencyDetails) {
        throw new NotFoundException('Currency not found');
      }

      let amountInHkd = orderData.amountOfDelivery;

      if (orderData.currency === Currency.CNY) {
        amountInHkd = orderData.amountOfDelivery / currencyDetails.hkdToCny;
      } else if (orderData.currency === Currency.MOP) {
        amountInHkd = orderData.amountOfDelivery / currencyDetails.hkdToMop;
      }

      const createdOrder = await this.orderRepository.createOrder({
        ...orderData,
        amountInHkd,
        createdBy: userId,
      });

      if (!createdOrder) {
        throw new InternalServerErrorException();
      }
      return {
        success: true,
        statusCode: 201,
        id: createdOrder.id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error during creating Order for the invoice ${orderData.invoiceNumber}`,
        error,
      );
    }
  }

  async getOrderById(
    id: string,
    userId: string,
  ): Promise<{ order: Order; statusCode: number }> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      let order: Order;

      if (adminData.role === Role.EXECUTIVE) {
        order = await this.orderRepository.findOneByClause({
          where: { id, createdBy: userId },
          include: [Customer],
        });
      } else {
        order = await this.orderRepository.findOneByClause({
          where: { id },
          include: [Customer],
        });
      }

      if (
        adminData.role === Role.EXECUTIVE &&
        adminData.id !== order.createdBy
      ) {
        throw new UnauthorizedException(
          'You are not authorized to see the order',
        );
      }
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return {
        order,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching order',
        error,
      );
    }
  }

  async getOrderList(
    userId: string,
    query?: PaginationQueryDto,
  ): Promise<{ orders: Order[]; total: number; statusCode: number }> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      let orderData: Order[];
      let total: number;

      const whereClause =
        adminData.role === Role.ADMIN ? {} : { createdBy: userId };

      if (query.page === 0) {
        orderData = await this.orderRepository.findAllByClause({
          where: whereClause,
          include: [Customer],
        });
        total = orderData.length;
      } else {
        const offset = (query.page - 1) * query.limit;
        const { rows, count } =
          await this.orderRepository.findAndCountAllByClause({
            where: whereClause,
            include: [Customer],
            limit: query.limit,
            offset,
          });

        orderData = rows;
        total = count;
      }

      return {
        orders: orderData,
        total,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching orders',
        error,
      );
    }
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId: string,
  ): Promise<UpdateOrderResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      let order: Order;

      if (adminData.role === Role.EXECUTIVE) {
        order = await this.orderRepository.findOneByClause({
          where: { id, createdBy: userId },
        });
      } else {
        order = await this.orderRepository.findById(id);
      }

      if (
        adminData.role === Role.EXECUTIVE &&
        adminData.id !== order.createdBy
      ) {
        throw new UnauthorizedException(
          'You are not authorized to edit the order',
        );
      }

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      const currencyDetails = await this.currencyRepository.findOneByClause({
        where: { baseCurrency: Currency.HKD },
      });

      if (!currencyDetails) {
        throw new NotFoundException('Currency not found');
      }

      let amountInHkd = updateOrderDto.amountOfDelivery;

      if (
        updateOrderDto.currency === Currency.CNY ||
        order.currency === Currency.CNY
      ) {
        amountInHkd =
          updateOrderDto.amountOfDelivery / currencyDetails.hkdToCny;
      } else if (
        updateOrderDto.currency === Currency.MOP ||
        order.currency === Currency.MOP
      ) {
        amountInHkd =
          updateOrderDto.amountOfDelivery / currencyDetails.hkdToMop;
      }

      const success = await this.orderRepository.updateById(order.id, {
        ...updateOrderDto,
        amountInHkd,
        updatedAt: new Date(),
      });

      if (!success) {
        throw new InternalServerErrorException(
          'Error during updating the order',
        );
      }

      return { success, statusCode: 200, id: order.id };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during updating order',
        error.message || error,
      );
    }
  }

  async deleteOrder(
    id: string,
    userId: string,
  ): Promise<DeleteOrderResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      let order: Order;

      if (adminData.role === Role.EXECUTIVE) {
        order = await this.orderRepository.findOneByClause({
          where: { id, createdBy: userId },
        });
      } else {
        order = await this.orderRepository.findById(id);
      }

      if (
        adminData.role === Role.EXECUTIVE &&
        adminData.id !== order.createdBy
      ) {
        throw new UnauthorizedException(
          'You are not authorized to delete the order',
        );
      }
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      const success = await this.orderRepository.deleteByClause({
        where: { id: order.id },
      });
      if (!success) {
        throw new InternalServerErrorException(
          'Error during deleting the order',
        );
      }
      return { success: true, statusCode: 200 };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during deleting invoice',
        error,
      );
    }
  }
}
