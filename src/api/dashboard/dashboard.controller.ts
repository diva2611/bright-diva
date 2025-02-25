import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { FinancialSummaryDto } from './dto/financial-summary.res.dto';
import { Request } from 'express';
import { FilterQueryDto } from './dto/filter-type.dto';
import { FilterResponseDto } from './dto/filter-res.dto';
import { Admin } from 'src/models/Admin/Admin.model';

@Controller()
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getFinancialSummary(
    @Req() request: Request,
  ): Promise<FinancialSummaryDto> {
    const { id: userId } = request.user as Admin;
    return await this.dashboardService.getFinancialSummary(userId);
  }

  @Get('filter')
  @HttpCode(HttpStatus.OK)
  async getFilteredData(
    @Req() request: Request,
    @Query() filterQueryDto: FilterQueryDto,
  ): Promise<FilterResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.dashboardService.getFilteredData(userId, filterQueryDto);
  }
}
