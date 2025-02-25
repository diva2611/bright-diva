import { BelongsTo } from 'sequelize-typescript';
import { AdminBase } from '../Admin/Admin.base';
import { CustomerBase } from './Customer.base';

export class Customer extends CustomerBase {
  @BelongsTo(() => AdminBase, {
    foreignKey: {
      name: 'id',
    },
  })
  user: AdminBase;
}
