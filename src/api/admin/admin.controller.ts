import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginResponseDto } from './dtos/admin-list-res.dto';
import { AdminService } from './admin.service';
import { LoginDto } from './dtos/login.dto';
import { LogoutResponseDto } from './dtos/logout-res.dto';
import { CreateCustomerDto } from './dtos/create-customer-dto';
import { Request } from 'express';
import { CreateCustomerResponseDto } from './dtos/create-customer.res.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ChangePasswordResponseDto } from './dtos/change-password.res.dto';
import { CreateAdminResponseDto } from './dtos/create-admin-res.dto';
import { CreateAdminDto } from './dtos/create-admin-req.dto';
import { DeleteAdminResponseDto } from './dtos/delete-admin-res.dto';
import { UpdateAdminDto } from './dtos/update-admin-req.dto';
import { UpdateAdminResponseDto } from './dtos/update-admin-res.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Admin } from 'src/models/Admin/Admin.model';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    return await this.adminService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Headers('authorization') authorization: string,
  ): Promise<LogoutResponseDto> {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not found or invalid format');
    }

    const token = authorization.replace('Bearer ', '');
    return await this.adminService.logout(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getAdminList(
    @Req() request: Request,
    @Query() query?: PaginationQueryDto,
  ): Promise<{ statusCode: number; data: Admin[]; total: number }> {
    const { id: userId } = request.user as Admin;
    return await this.adminService.getAdminList(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create-customer')
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
    @Req() request: Request,
  ): Promise<CreateCustomerResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.adminService.createCustomer(createCustomerDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getAdminById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<{ statusCode: number; data: Admin }> {
    const { id: userId } = request.user as Admin;
    return await this.adminService.getAdminById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: Request,
  ): Promise<ChangePasswordResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.adminService.changePassword(userId, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteAdmin(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<DeleteAdminResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.adminService.deleteAdmin(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit/:id')
  @HttpCode(HttpStatus.OK)
  async editCash(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Req() request: Request,
  ): Promise<UpdateAdminResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.adminService.updateAdmin(id, updateAdminDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create-admin')
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @Req() request: Request,
  ): Promise<CreateAdminResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.adminService.createAdmin(createAdminDto, userId);
  }
}
