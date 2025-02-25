import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Transaction } from 'sequelize';
import { OrderCreationAttributes } from 'src/models/order/Order.base';
import { Order } from 'src/models/Order/Order.model';


@Injectable()
export class OrderRepository {
  constructor(@InjectModel(Order) private orderModel: typeof Order) {}

  async findOneByClause(whereClause: FindOptions<Order>) {
    return this.orderModel.findOne(whereClause);
  }

  async findAllByClause(whereClause: FindOptions<Order>) {
    return this.orderModel.findAll(whereClause);
  }

  async findAll() {
    return this.orderModel.findAll();
  }

  async findById(orderId: string) {
    const order = await this.orderModel.findOne({
      where: { id: orderId },
      raw: true,
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findAndCountAllByClause(whereClause: FindOptions<Order>) {
    return this.orderModel.findAndCountAll(whereClause);
  }

  async deleteByClause(
    whereClause: FindOptions<Order>,
    transaction?: Transaction,
  ) {
    return await this.orderModel.destroy({
      where: whereClause.where,
      transaction,
    });
  }

  async updateById(
    id: string,
    updateOrder: Partial<Order>,
    transaction?: Transaction,
  ) {
    const [affectedCount] = await this.orderModel.update(updateOrder, {
      where: { id },
      transaction,
    });

    return !!affectedCount;
  }

  async createOrder(
    newOrder: OrderCreationAttributes,
    transaction?: Transaction,
  ): Promise<Order> {
    return this.orderModel.create(newOrder, { transaction });
  }
}
