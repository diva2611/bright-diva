import { IsEnum, IsUUID } from 'class-validator';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Currency } from '../../common/enum/currency.enum';
import { CustomerBase } from '../Customer/Customer.base';
import { AdminBase } from '../Admin/Admin.base';


type InvoiceAttributes =
  | 'invoiceDate'
  | 'invoiceNumber'
  | 'customerId'
  | 'amount'
  | 'currency'
  | 'amountInHkd'
  | 'createdBy'
  | 'totalUnits';

export type InvoiceCreationAttributes = Pick<InvoiceBase, InvoiceAttributes>;

@Table({
  tableName: 'invoice',
  timestamps: true,
  underscored: true,
})
export class InvoiceBase extends Model<InvoiceBase, InvoiceCreationAttributes> {
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  invoiceNumber!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => CustomerBase)
  customerId!: string;

  @Column({
    type: DataType.DECIMAL(64, 20),
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.INTEGER(),
    allowNull: false,
  })
  totalUnits!: number;

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
    type: DataType.DATE,
    allowNull: false,
  })
  invoiceDate: Date;

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
