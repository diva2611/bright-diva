import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Transaction } from 'sequelize';
import { CashCreationAttributes } from 'src/models/Cash/Cash.base';
import { Cash } from 'src/models/Cash/Cash.model';

@Injectable()
export class CashRepository {
  constructor(@InjectModel(Cash) private cashModel: typeof Cash) {}

  async findOneByClause(whereClause: FindOptions<Cash>) {
    return this.cashModel.findOne(whereClause);
  }

  async deleteByClause(
    whereClause: FindOptions<Cash>,
    transaction?: Transaction,
  ) {
    return await this.cashModel.destroy({
      where: whereClause.where,
      transaction,
    });
  }

  async findAllByClause(whereClause: FindOptions<Cash>) {
    return this.cashModel.findAll(whereClause);
  }

  async findAndCountAllByClause(whereClause: FindOptions<Cash>) {
    return this.cashModel.findAndCountAll(whereClause);
  }

  async findLatestReceiptNumber() {
    return await this.cashModel.findOne({
      order: [['receiptNumber', 'DESC']],
    });
  }

  async findAll() {
    return this.cashModel.findAll();
  }

  async findById(cashId: string) {
    const cash = await this.cashModel.findOne({
      where: { id: cashId },
      raw: true,
    });
    if (!cash) {
      throw new NotFoundException('Cash not found');
    }
    return cash;
  }

  async updateById(
    id: string,
    updateCash: Partial<Cash>,
    transaction?: Transaction,
  ) {
    const [affectedCount] = await this.cashModel.update(updateCash, {
      where: { id },
      transaction,
    });

    return !!affectedCount;
  }

  async createCash(
    newCash: CashCreationAttributes,
    transaction?: Transaction,
  ): Promise<Cash> {
    return this.cashModel.create(newCash, { transaction });
  }
}
