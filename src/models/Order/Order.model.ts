import { BelongsTo } from 'sequelize-typescript';
import { InvoiceBase } from '../Invoice/Invoice.base';
import { OrderBase } from './Order.base';
import { AdminBase } from '../Admin/Admin.base';
import { CustomerBase } from '../Customer/Customer.base';


export class Order extends OrderBase {
  @BelongsTo(() => InvoiceBase)
  invoiceDetails: InvoiceBase;

  @BelongsTo(() => AdminBase, {
    foreignKey: {
      name: 'id',
    },
  })
  user: AdminBase;

  @BelongsTo(() => CustomerBase, {
    foreignKey: {
      name: 'customerId',
    },
  })
  customer: CustomerBase;
}
