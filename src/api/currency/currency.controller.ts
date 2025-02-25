import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { CurrencyService } from './currency.service';
import { Request } from 'express';
import { UpdateCurrencyDto } from './dto/update-currency-dto';
import { UpdateCurrencyResponseDto } from './dto/update-currency-res.dto';
import { Currency } from 'src/models/Currency/Currency.model';
import { Admin } from 'src/models/Admin/Admin.model';

@Controller()
@UseGuards(JwtAuthGuard)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getCurrency(
    @Req() request: Request,
  ): Promise<{ currency: Currency[]; statusCode: number }> {
    const { id: userId } = request.user as Admin;
    return await this.currencyService.getCurrencyList(userId);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getCurrencyById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<{ currency: Currency; statusCode: number }> {
    const { id: userId } = request.user as Admin;
    return await this.currencyService.getCurrencyById(id, userId);
  }

   @Put('/edit/:id')
    @HttpCode(HttpStatus.OK)
    async editCurrency(
      @Param('id') id: string,
      @Body() updateCurrencyDto: UpdateCurrencyDto,
      @Req() request: Request,
    ): Promise<UpdateCurrencyResponseDto> {
      const { id: userId } = request.user as Admin;
      return await this.currencyService.updateCurrency(
        id,
        updateCurrencyDto,
        userId,
      );
    }
}
