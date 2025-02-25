import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RepositoryModule } from '../../repositories/repository.module';
import { JwtModule } from '@nestjs/jwt';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';


@Module({
  imports: [ConfigModule, RepositoryModule, JwtModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
