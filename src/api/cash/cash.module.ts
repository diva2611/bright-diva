import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RepositoryModule } from '../../repositories/repository.module';
import { JwtModule } from '@nestjs/jwt';
import { CashController } from './cash.controller';
import { CashService } from './cash.service';


@Module({
  imports: [ConfigModule, RepositoryModule, JwtModule],
  controllers: [CashController],
  providers: [CashService],
  exports: [CashService],
})
export class CashModule {}
