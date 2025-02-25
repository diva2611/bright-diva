import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { LoginResponseDto } from './dtos/admin-list-res.dto';
import { AdminRepository } from 'src/repositories/admin/admin.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LogoutResponseDto } from './dtos/logout-res.dto';
import { CreateCustomerDto } from './dtos/create-customer-dto';
import { CreateCustomerResponseDto } from './dtos/create-customer.res.dto';
import { Role } from '../../common/enum/role.enum';
import { CustomerRepository } from '../../repositories/customer/customer.repository';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ChangePasswordResponseDto } from './dtos/change-password.res.dto';
import { isValidPassword } from '../../common/utils/password.utils';
import { CreateAdminDto } from './dtos/create-admin-req.dto';
import { DeleteAdminResponseDto } from './dtos/delete-admin-res.dto';
import { UpdateAdminDto } from './dtos/update-admin-req.dto';
import { UpdateAdminResponseDto } from './dtos/update-admin-res.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Admin } from 'src/models/Admin/Admin.model';

@Injectable()
export class AdminService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminRepository: AdminRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly configService: ConfigService,
  ) {}

  async getAdminList(
    userId: string,
    query?: PaginationQueryDto,
  ): Promise<{ statusCode: number; data: Admin[]; total: number }> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData || adminData.role !== Role.ADMIN) {
        throw new UnauthorizedException('You are not authorized');
      }

      let cashData: Admin[];
      let total: number;

      if (query.page === 0) {
        cashData = await this.adminRepository.findAllByClause({
          where: { id: { [Op.ne]: userId } },
        });
        total = cashData.length;
      } else {
        const offset = (query.page - 1) * query.limit;
        const { rows, count } =
          await this.adminRepository.findAndCountAllByClause({
            where: { id: { [Op.ne]: userId } },
            limit: query.limit,
            offset,
          });
        cashData = rows;
        total = count;
      }

      return {
        statusCode: 200,
        data: cashData,
        total,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching admin list',
      );
    }
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    try {
      const userData = await this.adminRepository.findOneByClause({
        where: { emailId: email },
      });

      if (!userData) {
        throw new NotFoundException('User does not exist');
      }

      const isPasswordMatch = await bcrypt.compare(password, userData.password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: userData.emailId, userId: userData.id };

      const accessSecret = this.configService.get(
        'JWT.ACCESS_SECRET',
      ) as string;

      const token = this.jwtService.sign(payload, {
        secret: accessSecret,
      });

      if (!token) {
        throw new InternalServerErrorException();
      }

      const success = await this.adminRepository.updateById(userData.id, {
        token,
      });

      return {
        success,
        user: userData,
        statusCode: 200,
        token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getAdminById(
    id: string,
    userId: string,
  ): Promise<{ statusCode: number; data: Admin }> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData || adminData.role !== Role.ADMIN) {
        throw new UnauthorizedException('You are not authorized');
      }

      const admin = await this.adminRepository.findById(id);

      if (!admin) {
        throw new NotFoundException('Admin/Executive not found');
      }

      return {
        statusCode: 200,
        data: admin,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching order',
        error,
      );
    }
  }

  async deleteAdmin(
    id: string,
    userId: string,
  ): Promise<DeleteAdminResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData || adminData.role !== Role.ADMIN) {
        throw new UnauthorizedException('You are not authorized');
      }

      const admins = await this.adminRepository.findById(id);

      if (!admins) {
        throw new NotFoundException(`Admin/Executive with ID ${id} not found`);
      }

      const success = await this.adminRepository.deleteByClause({
        where: { id: admins.id },
      });
      if (!success) {
        throw new InternalServerErrorException(
          'Error during deleting the admin/executive',
        );
      }
      return { success: true, statusCode: 200 };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during deleting admin/executive',
        error,
      );
    }
  }

  async updateAdmin(
    id: string,
    updateAdminDto: UpdateAdminDto,
    userId: string,
  ): Promise<UpdateAdminResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData || adminData.role !== Role.ADMIN) {
        throw new UnauthorizedException('You are not authorized');
      }

      const admin = await this.adminRepository.findById(id);

      if (!admin) {
        throw new NotFoundException(`Admin/Executive with ID ${id} not found`);
      }

      if (updateAdminDto.password) {
        const hashedPassword = await bcrypt.hash(updateAdminDto.password, 10);
        updateAdminDto.password = hashedPassword;
      }

      const success = await this.adminRepository.updateById(admin.id, {
        ...updateAdminDto,
        updatedAt: new Date(),
      });

      if (!success) {
        throw new InternalServerErrorException(
          'Error during updating the admin/executive',
        );
      }

      return { success, statusCode: 200 };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during updating admin/executive',
        error,
      );
    }
  }

  async logout(token: string): Promise<LogoutResponseDto> {
    try {
      const userData = await this.adminRepository.findOneByClause({
        where: { token },
      });

      if (!userData || !userData.token) {
        throw new NotFoundException('User does not exist');
      }

      const success = await this.adminRepository.updateById(userData.id, {
        token: null,
      });

      return {
        success,
        statusCode: 200,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error during logout', error);
    }
  }

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
    userId: string,
  ): Promise<CreateCustomerResponseDto> {
    try {
      const userData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!userData) {
        throw new NotFoundException('User does not exist');
      }

      if (userData.role !== Role.ADMIN) {
        throw new UnauthorizedException('You are not allowed to add customers');
      }

      const createdUser = await this.customerRepository.createCustomer({
        ...createCustomerDto,
        createdBy: userId,
      });

      if (!createdUser) {
        throw new InternalServerErrorException(
          'Error while creating the customer',
        );
      }
      return {
        success: true,
        statusCode: 201,
        id: createdUser.id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    try {
      const { oldPassword, newPassword } = changePasswordDto;

      if (!isValidPassword(newPassword)) {
        throw new BadRequestException(
          'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        );
      }

      const user = await this.adminRepository.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Old password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const success = await this.adminRepository.updateById(user?.id, {
        password: hashedPassword,
      });
      if (!success) {
        throw new InternalServerErrorException(
          'Error while updating the password',
        );
      }

      return {
        success,
        statusCode: 200,
        message: 'Password has been changed successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async createAdmin(
    createAdminDto: CreateAdminDto,
    userId: string,
  ): Promise<CreateCustomerResponseDto> {
    try {
      const userData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!userData) {
        throw new NotFoundException('User does not exist');
      }

      if (userData.role !== Role.ADMIN) {
        throw new UnauthorizedException(
          'You are not allowed to add admin / executives',
        );
      }

      const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

      const createdAdmin = await this.adminRepository.createAdmin({
        ...createAdminDto,
        password: hashedPassword,
        createdAt: new Date(),
        createdBy: userId,
      });

      if (!createdAdmin) {
        throw new InternalServerErrorException(
          'Error while creating the admin/ executive',
        );
      }
      return {
        success: true,
        statusCode: 201,
        id: createdAdmin.id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
