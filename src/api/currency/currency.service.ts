import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrencyRepository } from '../../repositories/currency/currency-repository';
import { AdminRepository } from '../../repositories/admin/admin.repository';
import { UpdateCurrencyDto } from './dto/update-currency-dto';
import { UpdateCurrencyResponseDto } from './dto/update-currency-res.dto';
import { Currency } from 'src/models/Currency/Currency.model';

@Injectable()
export class CurrencyService {
  constructor(
    private readonly currencyRepository: CurrencyRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async getCurrencyList(
    userId: string,
  ): Promise<{ currency: Currency[]; statusCode: number }> {
    try {
      const adminData = await this.adminRepository.findById(userId);
      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      const currencyData = await this.currencyRepository.findAll();

      return { currency: currencyData, statusCode: 200 };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching currency',
        error,
      );
    }
  }

  async getCurrencyById(
    id: string,
    userId: string,
  ): Promise<{ currency: Currency; statusCode: number }> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      const currency = await this.currencyRepository.findById(id);

      return {
        currency,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching currency',
        error,
      );
    }
  }

  async updateCurrency(
    id: string,
    updateCurrencyDto: UpdateCurrencyDto,
    userId: string,
  ): Promise<UpdateCurrencyResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException(
          'You are not authorized to update the currency',
        );
      }

      const success = await this.currencyRepository.updateById(id, {
        ...updateCurrencyDto,
        updatedAt: new Date(),
        updatedBy: userId,
      });

      if (!success) {
        throw new InternalServerErrorException(
          'Error during updating the currency, You have not changed any field of customer',
        );
      }

      return { success, statusCode: 200 };
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
}
