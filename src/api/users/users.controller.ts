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
import { Request } from 'express';
import { Admin } from 'src/models/Admin/Admin.model';
import { UsersService } from './users.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateUserDto } from './dto/update-user-req.dto';
import { UpdateUserResponseDto } from './dto/update-user-res.dto';
import { DeleteUserResponseDto } from './dto/delete-user-res.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Req() request: Request,
    @Query() query?: PaginationQueryDto,
  ): Promise<{ users: Admin[]; total: number; statusCode: number }> {
    const { id: userId } = request.user as Admin;
    return await this.usersService.getUsersList(userId, query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<{ user: Admin; statusCode: number }> {
    const { id: userId } = request.user as Admin;
    return await this.usersService.getUserById(id, userId);
  }

  @Put('/edit/:id')
  @HttpCode(HttpStatus.OK)
  async editUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ): Promise<UpdateUserResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.usersService.updateUser(id, updateUserDto, userId);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<DeleteUserResponseDto> {
    const { id: userId } = request.user as Admin;
    return await this.usersService.deleteUser(id, userId);
  }
}
