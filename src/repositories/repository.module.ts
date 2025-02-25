import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminRepository } from './admin/admin.repository';
import { InvoiceRepository } from './invoice/invoice.repository';
import { OrderRepository } from './order/order.repository';
import { CustomerRepository } from './customer/customer.repository';
import { CashRepository } from './cash/cash.repository';
import { CurrencyRepository } from './currency/currency-repository';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    AdminRepository,
    OrderRepository,
    InvoiceRepository,
    CustomerRepository,
    CashRepository,
    CurrencyRepository,
  ],
  exports: [
    AdminRepository,
    OrderRepository,
    InvoiceRepository,
    CustomerRepository,
    CashRepository,
    CurrencyRepository,
  ],
})
export class RepositoryModule {}
