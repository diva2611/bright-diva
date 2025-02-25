import { IsEmail, IsEnum, IsOptional, IsUUID } from 'class-validator';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from '../../common/enum/role.enum';

type AdminAttributes =
  | 'emailId'
  | 'name'
  | 'username'
  | 'phoneNo'
  | 'role'
  | 'password'
  | 'createdAt'
  | 'createdBy';

export type AdminCreationAttributes = Pick<AdminBase, AdminAttributes>;

@Table({
  tableName: 'admin',
  timestamps: true,
  updatedAt: false,
  underscored: true,
})
export class AdminBase extends Model<AdminBase, AdminCreationAttributes> {
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @IsOptional()
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  name!: string;

  @IsOptional()
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  username!: string;

  @IsEmail()
  @IsOptional()
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  emailId!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string;

  @IsEnum(Role)
  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
  })
  role!: Role;

  @Column({
    type: DataType.STRING(15),
    allowNull: false,
  })
  phoneNo!: string;

  @IsOptional()
  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  token?: string;

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
    allowNull: true,
  })
  @ForeignKey(() => AdminBase)
  createdBy: string;
}
