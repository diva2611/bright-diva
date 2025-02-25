import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Transaction } from 'sequelize';
import { InvoiceCreationAttributes } from 'src/models/Invoice/Invoice.base';
import { Invoice } from 'src/models/Invoice/Invoice.model';

@Injectable()
export class InvoiceRepository {
  constructor(@InjectModel(Invoice) private invoiceModel: typeof Invoice) {}

  async findOneByClause(whereClause: FindOptions<Invoice>) {
    return this.invoiceModel.findOne(whereClause);
  }

  async findAndCountAllByClause(whereClause: FindOptions<Invoice>) {
    return this.invoiceModel.findAndCountAll(whereClause);
  }

  async findAllByClause(whereClause: FindOptions<Invoice>) {
    return this.invoiceModel.findAll(whereClause);
  }

  async findAll() {
    return this.invoiceModel.findAll();
  }

  async findById(invoiceId: string) {
    const invoice = await this.invoiceModel.findOne({
      where: { id: invoiceId },
      raw: true,
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async updateById(
    id: string,
    updateInvoice: Partial<Invoice>,
    transaction?: Transaction,
  ) {
    const [affectedCount] = await this.invoiceModel.update(updateInvoice, {
      where: { id },
      transaction,
    });

    return !!affectedCount;
  }

  async createInvoice(
    newInvoice: InvoiceCreationAttributes,
    transaction?: Transaction,
  ): Promise<Invoice> {
    return await this.invoiceModel.create(newInvoice, { transaction });
  }

  async deleteByClause(
    whereClause: FindOptions<Invoice>,
    transaction?: Transaction,
  ) {
    return await this.invoiceModel.destroy({
      where: whereClause.where,
      transaction,
    });
  }
}
