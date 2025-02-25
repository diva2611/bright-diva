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
import { AdminBase } from '../Admin/Admin.base';

type CashAttributes =
  | 'invoiceNumber'
  | 'receiptNumber'
  | 'createdBy'
  | 'customerId'
  | 'amount'
  | 'pickedBy'
  | 'cashPickupDate'
  | 'pickupTime'
  | 'currency'
  | 'amountInHkd'
  | 'partialDelivery';

export type CashCreationAttributes = Pick<CashBase, CashAttributes>;

@Table({
  tableName: 'cash',
  timestamps: true,
  underscored: true,
})
export class CashBase extends Model<CashBase, CashCreationAttributes> {
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  partialDelivery!: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  receiptNumber!: string;

  @ForeignKey(() => InvoiceBase)
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  invoiceNumber!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customerId!: string;

  @Column({
    type: DataType.DECIMAL(64, 20),
    allowNull: false,
  })
  amount!: number;

  @IsEnum(Currency)
  @Column({
    type: DataType.ENUM(...Object.values(Currency)),
    allowNull: false,
  })
  currency!: Currency;

  @Column({
    type: DataType.DECIMAL(64, 20),
    allowNull: false,
  })
  amountInHkd!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  pickedBy!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  cashPickupDate!: Date;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  pickupTime!: string;

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
