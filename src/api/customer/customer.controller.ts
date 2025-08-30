import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { Request } from 'express';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerResponseDto } from './dto/update-customer.res';
import { DeleteCustomerResponseDto } from './dto/delete-customer.res';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Customer } from 'src/models/Customer/Customer.model';
import { Admin } from 'src/models/Admin/Admin.model';

@Controller()
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getCustomers(
    @Req() request: Request,
    @Query() query?: PaginationQueryDto,
  ): Promise<{ customers: Customer[]; total: number; statusCode: number }> {
    const { id: userId } = request.user as Admin;
    return await this.customerService.getCustomersList(userId, query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getCustomerById(
    @Param('id') id: string,
  ): Promise<{ customer: Customer; statusCode: number }> {
    return await this.customerService.getCustomerById(id);
  }

  @Put('/edit/:id')
  @HttpCode(HttpStatus.OK)
  async editCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Req() request: Request,
  ): Promise<UpdateCustomerResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.customerService.updateCustomer(
      id,
      updateCustomerDto,
      userId,
    );
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteCustomer(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<DeleteCustomerResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.customerService.deleteCustomer(id, userId);
  }
}
