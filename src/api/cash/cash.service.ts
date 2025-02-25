import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InvoiceRepository } from '../../repositories/invoice/invoice.repository';
import { CreateCashDto } from './dto/create-cash-dto';
import { CreateCashResponseDto } from './dto/create-cash-res.dto';
import { CashRepository } from '../../repositories/cash/cash.repository';
import { DeleteCashResponseDto } from './dto/delete-cash-res.dto';
import { AdminRepository } from '../../repositories/admin/admin.repository';
import { Role } from '../../common/enum/role.enum';
import { UpdateCashDto } from './dto/update-cash-dto';
import { UpdateCashResponseDto } from './dto/update-cash-reciept.dto';
import { Currency } from '../../common/enum/currency.enum';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CurrencyRepository } from '../../repositories/currency/currency-repository';
import { Cash } from 'src/models/Cash/Cash.model';
import { Customer } from 'src/models/Customer/Customer.model';

@Injectable()
export class CashService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly cashRepository: CashRepository,
    private readonly adminRepository: AdminRepository,
    private readonly currencyRepository: CurrencyRepository,
  ) {}

  private readonly conversionRates = {
    [Currency.MOP]: 0.96,
    [Currency.HKD]: 1.03,
    [Currency.CNY]: 0.87,
  };

  async generateReceiptNumber(): Promise<string> {
    const latestReceipt = await this.cashRepository.findLatestReceiptNumber();
    let nextNumber: number | string = 1;
    if (latestReceipt) {
      const lastReceiptNumber = latestReceipt.receiptNumber;
      const match = lastReceiptNumber.match(/^RN:(\d{4})$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;

        if (nextNumber > 9999) {
          nextNumber = 'A001';
        } else {
          nextNumber = nextNumber.toString().padStart(4, '0');
        }
      } else {
        const alphabeticMatch = lastReceiptNumber.match(/^RN:([A-Z])(\d{3})$/);
        if (alphabeticMatch) {
          const letter = alphabeticMatch[1];
          let number = parseInt(alphabeticMatch[2], 10) + 1;

          if (number > 999) {
            const nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
            nextNumber = `${nextLetter}001`;
          } else {
            nextNumber = `${letter}${number.toString().padStart(3, '0')}`;
          }
        }
      }
    }
    const receiptNumber = `RN:${nextNumber}`;
    return receiptNumber;
  }

  async createCash(
    createCashDto: CreateCashDto,
    userId: string,
  ): Promise<CreateCashResponseDto> {
    try {
      const invoiceData = await this.invoiceRepository.findOneByClause({
        where: { invoiceNumber: createCashDto.invoiceNumber },
      });

      if (!invoiceData) {
        throw new NotFoundException('Invoice not found');
      }

      if (!this.conversionRates[createCashDto.currency]) {
        throw new InternalServerErrorException(
          `Unsupported currency: ${createCashDto.currency}`,
        );
      }

      if (!createCashDto.receiptNumber) {
        createCashDto.receiptNumber = await this.generateReceiptNumber();
      }

      const { receiptNumber, ...restOfDto } = createCashDto;

      const currencyDetails = await this.currencyRepository.findOneByClause({
        where: { baseCurrency: Currency.HKD },
      });

      if (!currencyDetails) {
        throw new NotFoundException('Currency not found');
      }

      let amountInHkd = createCashDto.amount;

      if (createCashDto.currency === Currency.CNY) {
        amountInHkd = createCashDto.amount / currencyDetails.hkdToCny;
      } else if (createCashDto.currency === Currency.MOP) {
        amountInHkd = createCashDto.amount / currencyDetails.hkdToMop;
      }

      const createdCash = await this.cashRepository.createCash({
        receiptNumber: createCashDto.receiptNumber,
        amountInHkd,
        createdBy: userId,
        ...restOfDto,
      });
      return {
        success: true,
        statusCode: 201,
        id: createdCash?.id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during creating cash',
        error,
      );
    }
  }

  async getCashList(
    userId: string,
    query?: PaginationQueryDto,
  ): Promise<{
    success: boolean;
    statusCode: number;
    data: Cash[];
    total: number;
  }> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      let cashData: Cash[];
      let total: number;

      const whereClause =
        adminData.role === Role.ADMIN ? {} : { createdBy: userId };

      if (query.page === 0) {
        cashData = await this.cashRepository.findAllByClause({
          where: whereClause,
          include: [Customer],
        });
        total = cashData.length;
      } else {
        const offset = (query.page - 1) * query.limit;
        const { rows, count } =
          await this.cashRepository.findAndCountAllByClause({
            where: whereClause,
            include: [Customer],
            limit: query.limit,
            offset,
          });
        cashData = rows;
        total = count;
      }

      return {
        success: true,
        statusCode: 200,
        data: cashData,
        total,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching cash list',
        error,
      );
    }
  }

  async getCashById(
    id: string,
    userId: string,
  ): Promise<{ success: boolean; statusCode: number; data: Cash }> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      let cash: Cash;
      if (adminData.role === Role.ADMIN) {
        cash = await this.cashRepository.findOneByClause({
          where: { id },
          include: [Customer],
        });
      } else {
        cash = await this.cashRepository.findOneByClause({
          where: { id, createdBy: userId },
          include: [Customer],
        });
      }

      if (!cash) {
        throw new NotFoundException('Cash not found');
      }

      return {
        success: true,
        statusCode: 200,
        data: cash,
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

  async deleteCash(id: string, userId: string): Promise<DeleteCashResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      const cash = await this.cashRepository.findById(id);

      if (
        adminData.role === Role.EXECUTIVE &&
        adminData.id !== cash.createdBy
      ) {
        throw new UnauthorizedException(
          'You are not authorized to delete the cash',
        );
      }
      if (!cash) {
        throw new NotFoundException(`Cash with ID ${id} not found`);
      }

      const success = await this.cashRepository.deleteByClause({
        where: { id: cash.id },
      });
      if (!success) {
        throw new InternalServerErrorException(
          'Error during deleting the cash',
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

  async updateCash(
    id: string,
    updateCashDto: UpdateCashDto,
    userId: string,
  ): Promise<UpdateCashResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      const cash = await this.cashRepository.findById(id);
      if (
        adminData.role === Role.EXECUTIVE &&
        adminData.id !== cash.createdBy
      ) {
        throw new UnauthorizedException(
          'You are not authorized to edit the cash',
        );
      }

      if (!cash) {
        throw new NotFoundException(`Cash with ID ${id} not found`);
      }

      const currencyDetails = await this.currencyRepository.findOneByClause({
        where: { baseCurrency: Currency.HKD },
      });

      if (!currencyDetails) {
        throw new NotFoundException('Currency not found');
      }

      let amountInHkd = updateCashDto.amount;

      if (
        updateCashDto.currency === Currency.CNY ||
        cash.currency === Currency.CNY
      ) {
        amountInHkd = updateCashDto.amount / currencyDetails.hkdToCny;
      } else if (
        updateCashDto.currency === Currency.MOP ||
        cash.currency === Currency.MOP
      ) {
        amountInHkd = updateCashDto.amount / currencyDetails.hkdToMop;
      }

      const success = await this.cashRepository.updateById(cash.id, {
        ...updateCashDto,
        amountInHkd,
        updatedAt: new Date(),
      });

      if (!success) {
        throw new InternalServerErrorException(
          'Error during updating the cash',
        );
      }

      return { success, statusCode: 200, id: cash.id };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during updating cash',
        error,
      );
    }
  }

  // async getCashReceiptDetails(invoiceNumber: string): Promise<CashReceiptDetailsDto> {
  //   try {
  //     const invoiceData = await this.invoiceRepository.findOneByClause({
  //       where: { invoiceNumber },
  //     });

  //     if (!invoiceData) {
  //       throw new NotFoundException('Invoice not found');
  //     }

  //     // Fetch customer data
  //     const customerData = await this.customerRepository.findOneByClause({
  //       where: { id: invoiceData.customerId },
  //     });

  //     if (!customerData) {
  //       throw new NotFoundException('Customer not found');
  //     }

  //     // Fetch associated order data
  //     const orderData = await this.orderRepository.findOneByClause({
  //       where: { invoiceNumber },
  //     });

  //     if (!orderData) {
  //       throw new NotFoundException('Order not found');
  //     }

  //     // Fetch cash receipt data related to the invoice
  //     const cashReceipts = await this.cashRepository.findAll({
  //       where: { invoiceNumber },
  //     });

  //     // Calculate the total paid and remaining amounts
  //     const paidAmount = cashReceipts.reduce(
  //       (total, receipt) => total + receipt.paymentAmount,
  //       0,
  //     );
  //     const remainingAmount = invoiceData.totalAmount - paidAmount;

  //     // Map to CashReceiptDetailsDto
  //     const cashReceiptDetails = new CashReceiptDetailsDto();
  //     cashReceiptDetails.customer = {
  //       customerName: customerData.name,
  //       customerContact: customerData.contact,
  //       customerEmail: customerData.email,
  //     };
  //     cashReceiptDetails.invoice = {
  //       invoiceNumber: invoiceData.invoiceNumber,
  //       invoiceDate: invoiceData.invoiceDate,
  //       totalAmount: invoiceData.totalAmount,
  //       paidAmount,
  //       remainingAmount,
  //     };
  //     cashReceiptDetails.order = {
  //       orderNumber: orderData.orderNumber,
  //       orderAmount: orderData.totalAmount,
  //       orderDeliveryStatus: orderData.deliveryStatus,
  //     };
  //     cashReceiptDetails.cashReceipts = cashReceipts.map(receipt => ({
  //       receiptNumber: receipt.receiptNumber,
  //       paymentStatus: receipt.paymentStatus,
  //       paymentAmount: receipt.paymentAmount,
  //       paymentDate: receipt.paymentDate,
  //     }));

  //     return cashReceiptDetails;
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(
  //       'Error during fetching cash receipt details',
  //       error,
  //     );
  //   }
  // }
}
