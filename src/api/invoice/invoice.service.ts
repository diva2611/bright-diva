import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InvoiceRepository } from '../../repositories/invoice/invoice.repository';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateInvoiceResponseDto } from './dto/create-invoice-res.dto';
import { Currency } from '../../common/enum/currency.enum';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UpdateInvoiceResponseDto } from './dto/update-invoice-res.dto';
import { DeleteInvoiceResponseDto } from './dto/delete-invoice.res.dto';
import { AdminRepository } from '../../repositories/admin/admin.repository';
import { Role } from '../../common/enum/role.enum';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { InvoicePaymentStatusDto } from './dto/invoice-payment-status.dto';
import { CashRepository } from '../../repositories/cash/cash.repository';
import { CurrencyRepository } from '../../repositories/currency/currency-repository';
import { Invoice } from 'src/models/Invoice/Invoice.model';
import { Customer } from 'src/models/Customer/Customer.model';
import { InvoiceListResDto } from './dto/invoice-list-res.dto';
import { Op } from 'sequelize';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly currencyRepository: CurrencyRepository,
    private readonly cashRepository: CashRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async getInvoiceList(
    userId: string,
    query?: PaginationQueryDto,
  ): Promise<InvoiceListResDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      const whereClause: any = {};
      const searchValue = `%${query.search}%`;

      if (query?.search) {
        whereClause[Op.or] = [
          { invoiceNumber: { [Op.like]: searchValue } },
          { amount: { [Op.like]: searchValue } },
          { amountInHkd: { [Op.like]: searchValue } },
          { totalUnits: { [Op.like]: searchValue } },
          { currency: { [Op.like]: searchValue } },
          { invoiceDate: { [Op.like]: searchValue } },
          { expectedPaymentDate: { [Op.like]: searchValue } },
        ];
      }

      let orderClause: any = [['createdAt', 'DESC']];
      if (query?.sortBy) {
        const [field, direction] = query.sortBy.split(':');
        if (field && ['asc', 'desc'].includes(direction?.toLowerCase())) {
          orderClause = [[field, direction.toUpperCase()]];
        }
      }

      const includes = [
        {
          model: Customer,
          required: false,
          where: query?.search
            ? {
                [Op.or]: [
                  { address: { [Op.like]: searchValue } },
                  { city: { [Op.like]: searchValue } },
                  { country: { [Op.like]: searchValue } },
                  { contactPersonName: { [Op.like]: searchValue } },
                  { companyName: { [Op.like]: searchValue } },
                  { mobileNumber: { [Op.like]: searchValue } },
                  { emailId: { [Op.like]: searchValue } },
                  { businessRegistrationNumber: { [Op.like]: searchValue } },
                ],
              }
            : undefined,
        },
      ];

      let invoiceData;
      let total: number;

      if (query.page === 0) {
        invoiceData = await this.invoiceRepository.findAllByClause({
          where: whereClause,
          include: includes,
          order: orderClause,
        });
        total = invoiceData.length;
      } else {
        const offset = (query.page - 1) * query.limit;
        const { rows, count } =
          await this.invoiceRepository.findAndCountAllByClause({
            where: whereClause,
            include: includes,
            limit: query.limit,
            offset,
            order: orderClause,
          });

        invoiceData = rows;
        total = count;
      }

      for (const invoice of invoiceData) {
        const cashDetails = await this.cashRepository.findAllByClause({
          where: { invoiceNumber: invoice.invoiceNumber },
        });

        const paidAmount = cashDetails.map((item) =>
          parseFloat(String(item.amountInHkd)),
        );

        const totalPaidAmount = paidAmount.reduce((acc, curr) => acc + curr, 0);
        const remainingAmount =
          parseFloat(invoice.amountInHkd) - totalPaidAmount;

        invoice.setDataValue('totalPaidAmount', totalPaidAmount);
        invoice.setDataValue('remainingAmount', remainingAmount);
      }

      return {
        invoices: invoiceData,
        total,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching invoices',
        error,
      );
    }
  }

  async getInvoicePaymentStatus(
    invoiceId: string,
    userId: string,
  ): Promise<InvoicePaymentStatusDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      const invoice: Invoice = await this.invoiceRepository.findOneByClause({
        where: { id: invoiceId },
        include: [Customer],
      });

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      const cashEntries = await this.cashRepository.findAllByClause({
        where: { invoiceNumber: invoice.invoiceNumber },
      });

      const totalPaidFromCash = cashEntries.reduce(
        (total, cash) =>
          total +
          (isNaN(Number(cash.amountInHkd)) ? 0 : Number(cash.amountInHkd)),
        0,
      );

      const remainingAmount = invoice.amountInHkd - totalPaidFromCash;

      return {
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: Number(invoice.amountInHkd),
        amountPaid: totalPaidFromCash,
        remainingAmount,
        isFullyPaid: remainingAmount <= 0,
        invoiceData: invoice,
        cashData: cashEntries,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching invoices',
        error || error.message,
      );
    }
  }

  private readonly conversionRates = {
    [Currency.MOP]: 0.96,
    [Currency.HKD]: 1.03,
    [Currency.CNY]: 0.87,
  };

  async createInvoice(
    invoiceData: CreateInvoiceDto,
    userId: string,
  ): Promise<CreateInvoiceResponseDto> {
    try {
      const { currency } = invoiceData;

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

      let amountInHkd = invoiceData.amount;

      if (invoiceData.currency === Currency.CNY) {
        amountInHkd = invoiceData.amount / currencyDetails.hkdToCny;
      } else if (invoiceData.currency === Currency.MOP) {
        amountInHkd = invoiceData.amount / currencyDetails.hkdToMop;
      }

      const createdInvoice = await this.invoiceRepository.createInvoice({
        ...invoiceData,
        amountInHkd,
        createdBy: userId,
      });
      if (!createdInvoice) {
        throw new InternalServerErrorException('Unable to create the invoice');
      }
      return {
        success: true,
        statusCode: 201,
        id: createdInvoice?.id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during creating invoice',
        error.message || error,
      );
    }
  }

  async getInvoiceById(
    id: string,
    userId: string,
  ): Promise<{
    invoice: Invoice;
    statusCode: number;
    totalPaidAmount: number;
    remainingAmount: number;
  }> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      const invoice: Invoice = await this.invoiceRepository.findOneByClause({
        where: { id },
        include: [Customer],
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }

      const cashDetails = await this.cashRepository.findAllByClause({
        where: { invoiceNumber: invoice.invoiceNumber },
      });

      const paidAmount = cashDetails.map((item) =>
        parseFloat(String(item.amountInHkd)),
      );
      const totalPaidAmount = paidAmount.reduce((acc, curr) => acc + curr, 0);

      const remainingAmount = invoice?.amountInHkd - totalPaidAmount;

      return {
        invoice,
        totalPaidAmount,
        remainingAmount,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching invoice',
        error,
      );
    }
  }

  async updateInvoice(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
    userId: string,
  ): Promise<UpdateInvoiceResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      if (adminData.role === Role.EXECUTIVE) {
        throw new UnauthorizedException(
          'You are not authorized to edit the invoice',
        );
      }

      const invoice: Invoice = await this.invoiceRepository.findOneByClause({
        where: { id },
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }

      const currencyDetails = await this.currencyRepository.findOneByClause({
        where: { baseCurrency: Currency.HKD },
      });

      if (!currencyDetails) {
        throw new NotFoundException('Currency not found');
      }

      let amountInHkd = updateInvoiceDto.amount;

      if (
        updateInvoiceDto.currency === Currency.CNY ||
        invoice.currency === Currency.CNY
      ) {
        amountInHkd = updateInvoiceDto.amount / currencyDetails.hkdToCny;
      } else if (
        updateInvoiceDto.currency === Currency.MOP ||
        invoice.currency === Currency.MOP
      ) {
        amountInHkd = updateInvoiceDto.amount / currencyDetails.hkdToMop;
      }

      const updateDto = { amountInHkd, ...updateInvoiceDto };

      const success = await this.invoiceRepository.updateById(invoice.id, {
        ...updateDto,
        updatedAt: new Date(),
      });

      if (!success) {
        throw new InternalServerErrorException(
          'Error during updating the invoice',
        );
      }

      return { success, id: invoice.id, statusCode: 200 };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during updating invoice',
        error,
      );
    }
  }

  async deleteInvoice(
    id: string,
    userId: string,
  ): Promise<DeleteInvoiceResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      if (adminData.role === Role.EXECUTIVE) {
        throw new UnauthorizedException(
          'You are not authorized to see the invoice',
        );
      }

      const invoice: Invoice = await this.invoiceRepository.findOneByClause({
        where: { id },
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }

      const success = await this.invoiceRepository.deleteByClause({
        where: { id: invoice.id },
      });
      if (!success) {
        throw new InternalServerErrorException(
          'Error during deleting the invoice',
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
