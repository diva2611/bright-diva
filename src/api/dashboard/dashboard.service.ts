import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderRepository } from '../../repositories/order/order.repository';
import { FinancialSummaryDto } from './dto/financial-summary.res.dto';
import { CashRepository } from '../../repositories/cash/cash.repository';
import { InvoiceRepository } from '../../repositories/invoice/invoice.repository';
import { AdminRepository } from '../../repositories/admin/admin.repository';
import { Role } from '../../common/enum/role.enum';
import { FilterType } from './enum/filter-type.enum';
import { FilterResponseDto } from './dto/filter-res.dto';
import { Op } from 'sequelize';
import { FilterQueryDto } from './dto/filter-type.dto';
import { Order } from 'src/models/Order/Order.model';
import { Invoice } from 'src/models/Invoice/Invoice.model';
import { Cash } from 'src/models/Cash/Cash.model';

@Injectable()
export class DashboardService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly cashRepository: CashRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async getFinancialSummary(userId: string): Promise<FinancialSummaryDto> {
    try {
      const adminData = await this.adminRepository.findById(userId);

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      let totalOrders: Order[];
      let totalInvoices: Invoice[];
      let totalCash: Cash[];

      if (adminData.role === Role.EXECUTIVE) {
        totalOrders = await this.orderRepository.findAllByClause({
          where: { createdBy: userId },
        });
        totalInvoices = await this.invoiceRepository.findAllByClause({
          where: { createdBy: userId },
        });
        totalCash = await this.cashRepository.findAllByClause({
          where: { createdBy: userId },
        });
      } else {
        totalOrders = await this.orderRepository.findAll();
        totalInvoices = await this.invoiceRepository.findAll();
        totalCash = await this.cashRepository.findAll();
      }

      const totalOrderValue = totalOrders.length;

      const totalDeliveredValue = totalOrders.filter(
        (order) => !order.partialDelivery,
      ).length;

      const nonDeliveredValue = totalOrderValue - totalDeliveredValue;

      const totalCashPickup = totalCash.reduce(
        (sum, cash) => sum + Number(cash.amountInHkd),
        0,
      );

      const deliveredCashPickup = totalCash
        .filter((cash) =>
          totalOrders.some(
            (order) =>
              order.invoiceNumber === cash.invoiceNumber &&
              !order.partialDelivery,
          ),
        )
        .reduce((sum, cash) => sum + Number(cash.amountInHkd), 0);

      const totalNetDue = nonDeliveredValue + totalDeliveredValue;

      return {
        totalOrderValue,
        totalDeliveredValue,
        nonDeliveredValue,
        totalCashPickup,
        deliveredCashPickup,
        totalNetDue,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching orders',
        error.message || error,
      );
    }
  }

  async getFilteredData(
    userId: string,
    filterQueryDto?: FilterQueryDto,
  ): Promise<FilterResponseDto> {
    try {
      const {
        fromDate,
        toDate,
        limit: limitGiven,
        page: pageGiven,
        type,
      } = filterQueryDto;
      const adminData = await this.adminRepository.findById(userId);

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      let totalOrders = [];
      let totalInvoices = [];
      let totalCash = [];

      const dateFilter = {};
      if (fromDate) {
        dateFilter[Op.gte] = new Date(fromDate);
      }
      if (toDate) {
        dateFilter[Op.lte] = new Date(toDate);
      }

      const whereClause = fromDate || toDate ? { createdAt: dateFilter } : {};

      const page = pageGiven ?? 0;
      const limit = limitGiven ?? 20;
      const offset = page * limit;

      if (adminData.role === Role.EXECUTIVE) {
        if (!type || type === FilterType.ORDER || type === FilterType.ALL) {
          totalOrders = await this.orderRepository.findAllByClause({
            where: {
              createdBy: userId,
              ...whereClause,
            },
            limit,
            offset,
          });
        }

        if (!type || type === FilterType.INVOICE || type === FilterType.ALL) {
          totalInvoices = await this.invoiceRepository.findAllByClause({
            where: {
              createdBy: userId,
              ...whereClause,
            },
            limit,
            offset,
          });
        }

        if (!type || type === FilterType.CASH || type === FilterType.ALL) {
          totalCash = await this.cashRepository.findAllByClause({
            where: {
              createdBy: userId,
              ...whereClause,
            },
            limit,
            offset,
          });
        }
      } else {
        if (!type || type === FilterType.ORDER || type === FilterType.ALL) {
          totalOrders = await this.orderRepository.findAllByClause({
            where: { ...whereClause },
            limit,
            offset,
          });
        }

        if (!type || type === FilterType.INVOICE || type === FilterType.ALL) {
          totalInvoices = await this.invoiceRepository.findAllByClause({
            where: { ...whereClause },
            limit,
            offset,
          });
        }

        if (!type || type === FilterType.CASH || type === FilterType.ALL) {
          totalCash = await this.cashRepository.findAllByClause({
            where: { ...whereClause },
            limit,
            offset,
          });
        }
      }

      const dateRange =
        fromDate && toDate
          ? `From: ${fromDate} To: ${toDate}`
          : fromDate
            ? `From: ${fromDate}`
            : toDate
              ? `To: ${toDate}`
              : 'No date range specified';

      const responseData: FilterResponseDto = {
        type: type || FilterType.ALL,
        dateRange,
        statusCode: 200,
        data: {
          orders: totalOrders,
          invoices: totalInvoices,
          cashManagement: totalCash,
        },
      };

      return responseData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching filtered data',
        error.message || error,
      );
    }
  }
}
