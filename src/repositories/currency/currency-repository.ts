import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Transaction } from 'sequelize';
import { CurrencyCreationAttributes } from 'src/models/Currency/Currency.base';
import { Currency } from 'src/models/Currency/Currency.model';


@Injectable()
export class CurrencyRepository {
  constructor(@InjectModel(Currency) private currencyModel: typeof Currency) {}

  async findOneByClause(whereClause: FindOptions<Currency>) {
    return this.currencyModel.findOne(whereClause);
  }

  async findAndCountAllByClause(whereClause: FindOptions<Currency>) {
    return this.currencyModel.findAndCountAll(whereClause);
  }

  async deleteByClause(
    whereClause: FindOptions<Currency>,
    transaction?: Transaction,
  ) {
    return this.currencyModel.destroy({
      where: whereClause.where,
      transaction,
    });
  }

  async findAllByClause(whereClause: FindOptions<Currency>) {
    return this.currencyModel.findAll(whereClause);
  }

  async findAll() {
    return this.currencyModel.findAll();
  }

  async findById(currencyId: string) {
    const currency = await this.currencyModel.findOne({
      where: { id: currencyId },
      raw: true,
    });
    if (!currency) {
      throw new NotFoundException('Currency not found');
    }
    return currency;
  }

  async updateById(
    id: string,
    updateCurrency: Partial<Currency>,
    transaction?: Transaction,
  ) {
    const [affectedCount] = await this.currencyModel.update(updateCurrency, {
      where: { id },
      transaction,
    });

    return !!affectedCount;
  }

  async createCurrency(
    newCurrency: CurrencyCreationAttributes,
    transaction?: Transaction,
  ): Promise<Currency> {
    return await this.currencyModel.create(newCurrency, { transaction });
  }
}
