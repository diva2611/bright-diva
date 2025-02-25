import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Transaction } from 'sequelize';
import { CustomerCreationAttributes } from 'src/models/Customer/Customer.base';
import { Customer } from 'src/models/Customer/Customer.model';

@Injectable()
export class CustomerRepository {
  constructor(@InjectModel(Customer) private customerModel: typeof Customer) {}

  async findOneByClause(whereClause: FindOptions<Customer>) {
    return this.customerModel.findOne(whereClause);
  }

  async findAndCountAllByClause(whereClause: FindOptions<Customer>) {
    return this.customerModel.findAndCountAll(whereClause);
  }

  async deleteByClause(
    whereClause: FindOptions<Customer>,
    transaction?: Transaction,
  ) {
    return this.customerModel.destroy({
      where: whereClause.where,
      transaction,
    });
  }

  async findAllByClause(whereClause: FindOptions<Customer>) {
    return this.customerModel.findAll(whereClause);
  }

  async findAll() {
    return this.customerModel.findAll();
  }

  async findById(customerId: string) {
    const customer = await this.customerModel.findOne({
      where: { id: customerId },
      raw: true,
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async updateById(
    id: string,
    updateCustomer: Partial<Customer>,
    transaction?: Transaction,
  ) {
    const [affectedCount] = await this.customerModel.update(updateCustomer, {
      where: { id },
      transaction,
    });

    return !!affectedCount;
  }

  async createCustomer(
    newCustomer: CustomerCreationAttributes,
    transaction?: Transaction,
  ): Promise<Customer> {
    return await this.customerModel.create(newCustomer, { transaction });
  }
}
