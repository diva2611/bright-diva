import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './Admin/Admin.model';
import { Cash } from './Cash/Cash.model';
import { Currency } from './Currency/Currency.model';
import { Customer } from './Customer/Customer.model';
import { Invoice } from './Invoice/Invoice.model';
import { Order } from './Order/Order.model';


const models = [Admin, Invoice, Order, Customer, Cash, Currency];
@Global()
@Module({
  imports: [SequelizeModule.forFeature(models)],
  exports: [SequelizeModule.forFeature(models)],
})
export class ModelsModule {}
