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
import { CashService } from './cash.service';
import { CreateCashDto } from './dto/create-cash-dto';
import { CreateCashResponseDto } from './dto/create-cash-res.dto';
import { Request } from 'express';
import { DeleteCashResponseDto } from './dto/delete-cash-res.dto';
import { UpdateCashDto } from './dto/update-cash-dto';
import { UpdateCashResponseDto } from './dto/update-cash-reciept.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Admin } from 'src/models/Admin/Admin.model';
import { Cash } from 'src/models/Cash/Cash.model';

@Controller()
@UseGuards(JwtAuthGuard)
export class CashController {
  constructor(private readonly cashService: CashService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createCash(
    @Body() createCashDto: CreateCashDto,
    @Req() request: Request,
  ): Promise<CreateCashResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.cashService.createCash(createCashDto, userId);
  }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getCash(
    @Req() request: Request,
    @Query() query?: PaginationQueryDto,
  ): Promise<{
    success: boolean;
    statusCode: number;
    data: Cash[];
    total: number;
  }> {
    const { id: userId } = request.user as Admin;
    return await this.cashService.getCashList(userId, query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getCashById(
    @Param('id') id: string,
  ): Promise<{ success: boolean; statusCode: number; data: Cash }> {
    return await this.cashService.getCashById(id);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteCash(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<DeleteCashResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.cashService.deleteCash(id, userId);
  }

  @Put('/edit/:id')
  @HttpCode(HttpStatus.OK)
  async editCash(
    @Param('id') id: string,
    @Body() updateCashDto: UpdateCashDto,
    @Req() request: Request,
  ): Promise<UpdateCashResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.cashService.updateCash(id, updateCashDto, userId);
  }

  // @Get('/get-cash-receipt-details')
  // @HttpCode(HttpStatus.OK)
  // async getCashReceiptDetails(
  //   @Param('invoiceNumber') invoiceNumber: string,
  // ): Promise<CashReceiptDetailsDto> {
  //   return await this.cashService.getCashReceiptDetails(invoiceNumber);
  // }
}
