import { IsEnum, IsUUID } from 'class-validator';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Currency } from '../../common/enum/currency.enum';
import { InvoiceBase } from '../Invoice/Invoice.base';
import { CustomerBase } from '../Customer/Customer.base';
import { AdminBase } from '../Admin/Admin.base';

type OrderAttributes =
  | 'invoiceNumber'
  | 'amountOfDelivery'
  | 'currency'
  | 'amountInHkd'
  | 'partialDelivery'
  | 'createdBy'
  | 'deliveredUnits'
  | 'customerId'
  | 'orderNumber';

export type OrderCreationAttributes = Pick<OrderBase, OrderAttributes>;

@Table({
  tableName: 'order',
  timestamps: true,
  underscored: true,
})
export class OrderBase extends Model<OrderBase, OrderCreationAttributes> {
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING(),
    allowNull: false,
  })
  orderNumber!: string;

  @ForeignKey(() => InvoiceBase)
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  invoiceNumber!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  partialDelivery!: boolean;

  @Column({
    type: DataType.DECIMAL(64, 20),
    allowNull: false,
  })
  amountOfDelivery!: number;

  @IsEnum(Currency)
  @Column({
    type: DataType.ENUM(...Object.values(Currency)),
    allowNull: false,
  })
  currency!: Currency;

  @Column({
    type: DataType.INTEGER(),
    allowNull: false,
  })
  deliveredUnits!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  deliveredBy!: string;

  @Column({
    type: DataType.DECIMAL(64, 20),
    allowNull: false,
  })
  amountInHkd!: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ForeignKey(() => CustomerBase)
  customerId: string;

  @Column({
    field: 'created_at',
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => AdminBase)
  createdBy: string;
}
