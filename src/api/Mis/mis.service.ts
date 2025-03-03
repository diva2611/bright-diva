import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../../repositories/invoice/invoice.repository';

import { AdminRepository } from '../../repositories/admin/admin.repository';

import { CashRepository } from '../../repositories/cash/cash.repository';
import { CurrencyRepository } from '../../repositories/currency/currency-repository';

@Injectable()
export class MisService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly currencyRepository: CurrencyRepository,
    private readonly cashRepository: CashRepository,
    private readonly adminRepository: AdminRepository,
  ) {}
}
