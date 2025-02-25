import { BelongsTo } from 'sequelize-typescript';
import { CurrencyBase } from './Currency.base';
import { AdminBase } from '../Admin/Admin.base';



export class Currency extends CurrencyBase {
  @BelongsTo(() => AdminBase, {
    foreignKey: {
      name: 'createdBy',
    },
  })
  user: AdminBase;
}
