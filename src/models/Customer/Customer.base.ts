import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AdminBase } from '../Admin/Admin.base';


type CustomerAttributes =
  | 'createdBy'
  | 'address'
  | 'contactPersonName'
  | 'mobileNumber'
  | 'emailId'
  | 'businessRegistrationNumber'
  | 'city'
  | 'country'
  | 'companyName';

export type CustomerCreationAttributes = Pick<CustomerBase, CustomerAttributes>;

@Table({
  tableName: 'customer',
  timestamps: true,
  underscored: true,
})
export class CustomerBase extends Model<
  CustomerBase,
  CustomerCreationAttributes
> {
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @IsString()
  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  address: string;

  @IsString()
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  city: string;

  @IsString()
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  country: string;

  @IsOptional()
  @IsString()
  @Column({
    field: 'contact_person_name',
    type: DataType.STRING(255),
    allowNull: true,
  })
  contactPersonName?: string;

  @IsOptional()
  @IsString()
  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  companyName?: string;

  @IsString()
  @Column({
    field: 'mobile_number',
    type: DataType.STRING(20),
    allowNull: false,
  })
  mobileNumber: string;

  @IsEmail()
  @Column({
    field: 'email_id',
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  emailId: string;

  @IsString()
  @Column({
    field: 'business_registration_number',
    type: DataType.STRING(100),
    allowNull: false,
  })
  businessRegistrationNumber: string;

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
