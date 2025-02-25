import { BelongsTo } from 'sequelize-typescript';
import { InvoiceBase } from '../Invoice/Invoice.base';
import { CashBase } from './Cash.base';
import { AdminBase } from '../Admin/Admin.base';
import { CustomerBase } from '../Customer/Customer.base';


export class Cash extends CashBase {
  @BelongsTo(() => InvoiceBase, {
    foreignKey: {
      name: 'invoice_number',
    },
  })
  invoiceDetails: InvoiceBase;

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
