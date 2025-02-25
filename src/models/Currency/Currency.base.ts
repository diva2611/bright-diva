import { IsUUID } from 'class-validator';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AdminBase } from '../Admin/Admin.base';


type CurrencyAttributes =
  | 'baseCurrency'
  | 'hkdToMop'
  | 'hkdToCny'
  | 'createdBy';

export type CurrencyCreationAttributes = Pick<CurrencyBase, CurrencyAttributes>;

@Table({
  tableName: 'currency',
  timestamps: true,
  underscored: true,
})
export class CurrencyBase extends Model<
  CurrencyBase,
  CurrencyCreationAttributes
> {
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    unique: true,
  })
  baseCurrency!: string;

  @Column({
    type: DataType.FLOAT(),
    allowNull: false,
  })
  hkdToMop!: number;

  @Column({
    type: DataType.FLOAT(),
    allowNull: false,
  })
  hkdToCny!: number;

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

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ForeignKey(() => AdminBase)
  updatedBy: string;
}
