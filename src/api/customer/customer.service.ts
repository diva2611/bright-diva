import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminRepository } from '../../repositories/admin/admin.repository';
import { CustomerRepository } from '../../repositories/customer/customer.repository';
import { Role } from 'src/common/enum/role.enum';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerResponseDto } from './dto/update-customer.res';
import { DeleteCustomerResponseDto } from './dto/delete-customer.res';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Customer } from 'src/models/Customer/Customer.model';

@Injectable()
export class CustomerService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async getCustomersList(
    userId: string,
    query?: PaginationQueryDto,
  ): Promise<{ customers: Customer[]; total: number; statusCode: number }> {
    try {
      const adminData = await this.adminRepository.findById(userId);
      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      let customersData: Customer[];
      let total: number;

      const whereClause =
        adminData.role === Role.EXECUTIVE ? { createdBy: userId } : {};

      if (query.page === 0) {
        customersData = await this.customerRepository.findAllByClause({
          where: whereClause,
        });
        total = customersData.length;
      } else {
        const offset = (query.page - 1) * query.limit;
        const { rows, count } =
          await this.customerRepository.findAndCountAllByClause({
            where: whereClause,
            limit: query.limit,
            offset,
          });

        customersData = rows;
        total = count;
      }

      return {
        customers: customersData,
        total,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching customers',
        error,
      );
    }
  }

  async getCustomerById(
    id: string,
    userId: string,
  ): Promise<{ customer: Customer; statusCode: number }> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      const customer = await this.customerRepository.findById(id);

      if (
        adminData.role === Role.EXECUTIVE &&
        adminData.id !== customer.createdBy
      ) {
        throw new UnauthorizedException(
          'You are not authorized to see the customers data',
        );
      }
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return {
        customer,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching customer',
        error,
      );
    }
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    userId: string,
  ): Promise<UpdateCustomerResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (adminData.role === Role.EXECUTIVE) {
        throw new UnauthorizedException(
          'You are not authorized to update the customer',
        );
      }

      const success = await this.customerRepository.updateById(id, {
        ...updateCustomerDto,
        updatedAt: new Date(),
      });

      if (!success) {
        throw new InternalServerErrorException(
          'Error during updating the customer, You have not changed any field of customer',
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

  async deleteCustomer(
    id: string,
    userId: string,
  ): Promise<DeleteCustomerResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (adminData.role === Role.EXECUTIVE) {
        throw new UnauthorizedException(
          'You are not authorized to delete the customer',
        );
      }

      const success = await this.customerRepository.deleteByClause({
        where: { id },
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
