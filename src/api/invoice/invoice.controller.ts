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
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateInvoiceResponseDto } from './dto/create-invoice-res.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UpdateInvoiceResponseDto } from './dto/update-invoice-res.dto';
import { DeleteInvoiceResponseDto } from './dto/delete-invoice.res.dto';
import { Request } from 'express';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { InvoicePaymentStatusDto } from './dto/invoice-payment-status.dto';
import { Invoice } from 'src/models/Invoice/Invoice.model';
import { Admin } from 'src/models/Admin/Admin.model';

@Controller()
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getInvoices(
    @Req() request: Request,
    @Query() query?: PaginationQueryDto,
  ): Promise<{ invoices: Invoice[]; total: number; statusCode: number }> {
    const { id: userId } = request.user as Admin;
    return await this.invoiceService.getInvoiceList(userId, query);
  }

  @Get('/:id/payment-status')
  @HttpCode(HttpStatus.OK)
  async getInvoicePaymentStatus(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<InvoicePaymentStatusDto> {
    const { id: userId } = request.user as Admin;
    return await this.invoiceService.getInvoicePaymentStatus(id, userId);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getInvoiceById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<{ invoice: Invoice; statusCode: number }> {
    const { id: userId } = request.user as Admin;
    return await this.invoiceService.getInvoiceById(id, userId);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Req() request: Request,
  ): Promise<CreateInvoiceResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.invoiceService.createInvoice(createInvoiceDto, userId);
  }

  @Put('/edit/:id')
  @HttpCode(HttpStatus.OK)
  async editInvoice(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Req() request: Request,
  ): Promise<UpdateInvoiceResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.invoiceService.updateInvoice(
      id,
      updateInvoiceDto,
      userId,
    );
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteInvoice(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<DeleteInvoiceResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.invoiceService.deleteInvoice(id, userId);
  }
}
