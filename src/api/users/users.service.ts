import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../../common/enum/role.enum';
import { AdminRepository } from '../../repositories/admin/admin.repository';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { AdminBase } from 'src/models/Admin/Admin.base';
import { UpdateUserDto } from './dto/update-user-req.dto';
import { UpdateUserResponseDto } from './dto/update-user-res.dto';
import { DeleteUserResponseDto } from './dto/delete-user-res.dto';

@Injectable()
export class UsersService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getUsersList(
    userId: string,
    query?: PaginationQueryDto,
  ): Promise<{ users: AdminBase[]; total: number; statusCode: number }> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      const page = query?.page ?? 1;
      const limit = query?.limit ?? 10;

      if (page === 0) {
        const users = await this.adminRepository.findAllByClause({
          where: { id: { [Op.notIn]: [userId] } },
        });

        return {
          users,
          total: users.length,
          statusCode: 200,
        };
      }

      const offset = (page - 1) * limit;

      const { rows: users, count: total } =
        await this.adminRepository.findAndCountAllByClause({
          where: { id: { [Op.notIn]: [userId] } },
          limit,
          offset,
        });

      return {
        users,
        total,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during fetching users');
    }
  }

  async getUserById(
    id: string,
    userId: string,
  ): Promise<{ user: AdminBase; statusCode: number }> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData) {
        throw new UnauthorizedException('You are not authorized');
      }

      const user = await this.adminRepository.findOneByClause({
        where: { id },
      });

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      return {
        user,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during fetching user detail',
        error,
      );
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    userId: string,
  ): Promise<UpdateUserResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData && adminData.role !== Role.ADMIN) {
        throw new UnauthorizedException('You are not authorized');
      }

      const userToUpdate = await this.adminRepository.findOneByClause({
        where: { id },
      });

      if (!userToUpdate) {
        throw new BadRequestException('User not found');
      }

      if (
        updateUserDto.emailId &&
        updateUserDto.emailId !== userToUpdate.emailId
      ) {
        const existingEmailUser = await this.adminRepository.findOneByClause({
          where: { emailId: updateUserDto.emailId },
        });

        if (existingEmailUser) {
          throw new BadRequestException(
            'Email is already in use by another user',
          );
        }
      }

      if (
        updateUserDto.username &&
        updateUserDto.username !== userToUpdate.username
      ) {
        const existingUsernameUser = await this.adminRepository.findOneByClause(
          { where: { username: updateUserDto.username } },
        );

        if (existingUsernameUser) {
          throw new BadRequestException(
            'Username is already in use by another user',
          );
        }
      }

      const updatePayload: Partial<AdminBase> = {
        name: updateUserDto.name,
        username: updateUserDto.username,
        emailId: updateUserDto.emailId,
        role: updateUserDto.role as Role,
        phoneNo: updateUserDto.phoneNo,
        updatedAt: new Date(),
      };

      if (updateUserDto.password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
          updateUserDto.password,
          saltRounds,
        );
        updatePayload.password = hashedPassword;
      }

      const success = await this.adminRepository.updateById(id, updatePayload);

      return { success, statusCode: 200, id };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during updating user',
        error.message || error,
      );
    }
  }

  async deleteUser(id: string, userId: string): Promise<DeleteUserResponseDto> {
    try {
      const adminData = await this.adminRepository.findOneByClause({
        where: { id: userId },
      });

      if (!adminData && adminData.role !== Role.ADMIN) {
        throw new UnauthorizedException('You are not authorized');
      }

      const success = await this.adminRepository.deleteByClause({
        where: { id },
      });

      if (!success) {
        throw new InternalServerErrorException(
          'Error during deleting the user',
        );
      }
      return { success: true, statusCode: 200 };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during deleting user',
        error,
      );
    }
  }
}
