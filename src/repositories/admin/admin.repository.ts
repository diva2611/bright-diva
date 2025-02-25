import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Transaction } from 'sequelize';
import { AdminCreationAttributes } from 'src/models/Admin/Admin.base';
import { Admin } from 'src/models/Admin/Admin.model';

@Injectable()
export class AdminRepository {
  constructor(@InjectModel(Admin) private adminModel: typeof Admin) {}

  async findOneByClause(whereClause: FindOptions<Admin>) {
    return this.adminModel.findOne(whereClause);
  }

  async findAndCountAllByClause(whereClause: FindOptions<Admin>) {
    return this.adminModel.findAndCountAll(whereClause);
  }

  async deleteByClause(
      whereClause: FindOptions<Admin>,
      transaction?: Transaction,
    ) {
      return await this.adminModel.destroy({
        where: whereClause.where,
        transaction,
      });
    }

  async findAll() {
    return this.adminModel.findAll();
  }

  async findAllByClause(whereClause: FindOptions<Admin>) {
    return this.adminModel.findAll(whereClause);
  }

  async findById(userId: string): Promise<Admin> {
    const user = await this.adminModel.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateById(
    id: string,
    updateAdmin: Partial<Admin>,
    transaction?: Transaction,
  ) {
    const [affectedCount] = await this.adminModel.update(updateAdmin, {
      where: { id },
      transaction,
    });

    return !!affectedCount;
  }

  async createAdmin(
    newAdmin: AdminCreationAttributes,
    transaction?: Transaction,
  ): Promise<Admin> {
    return await this.adminModel.create(newAdmin, { transaction });
  }
}
