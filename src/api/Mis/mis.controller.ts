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
import { MisService } from './mis.service';
import { Request } from 'express';
import { MisFilterQueryDto } from './dto/mis-filter-query.dto';
import { GenerateMisReportResDto } from './dto/generate-mis-report-data.res';
import { Admin } from '../../models/Admin/Admin.model';

@Controller()
@UseGuards(JwtAuthGuard)
export class MisController {
  constructor(private readonly misService: MisService) {}

  @Get('generate-mis-report')
  @HttpCode(HttpStatus.OK)
  async generateMisReport(
    @Req() request: Request,
    @Query() misFilterQueryDto: MisFilterQueryDto,
  ): Promise<GenerateMisReportResDto> {
    const { id: userId } = request.user as Admin;
    return await this.misService.generateMisReport(userId, misFilterQueryDto);
  }
}
