import { BelongsTo } from 'sequelize-typescript';
import { AdminBase } from '../Admin/Admin.base';
import { InvoiceBase } from './Invoice.base';
import { CustomerBase } from '../Customer/Customer.base';

export class Invoice extends InvoiceBase {
  @BelongsTo(() => AdminBase, {
    foreignKey: {
      name: 'createdBy',
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
