import { RouterModule, Routes } from '@nestjs/core';

import {
  API_PREFIX,
  ROUTES,
  VERSION_1,
} from '../common/constants/routes.constants';
import { AdminModule } from './admin/admin.module';
import { InvoiceModule } from './invoice/invoice.module';
import { OrderModule } from './order/order.module';
import { CashModule } from './cash/cash.module';
import { CustomerModule } from './customer/customer.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CurrencyModule } from './currency/currency.module';
import { MisModule } from './Mis/mis.module';
import { UsersModule } from './users/users.module';

export const routes: Routes = [
  {
    path: `${API_PREFIX}/${VERSION_1}`,
    children: [
      {
        path: ROUTES.ADMIN,
        module: AdminModule,
      },
      {
        path: ROUTES.INVOICE,
        module: InvoiceModule,
      },
      {
        path: ROUTES.ORDER,
        module: OrderModule,
      },
      {
        path: ROUTES.CASH,
        module: CashModule,
      },
      {
        path: ROUTES.CUSTOMER,
        module: CustomerModule,
      },
      {
        path: ROUTES.DASHBOARD,
        module: DashboardModule,
      },
      {
        path: ROUTES.CURRENCY,
        module: CurrencyModule,
      },
      {
        path: ROUTES.MIS,
        module: MisModule,
      },
      {
        path: ROUTES.USERS,
        module: UsersModule,
      },
    ],
  },
];

export const ApiV1Imports = [
  RouterModule.register(routes),
  AdminModule,
  InvoiceModule,
  OrderModule,
  CashModule,
  CustomerModule,
  DashboardModule,
  CurrencyModule,
  MisModule,
  UsersModule,
];
