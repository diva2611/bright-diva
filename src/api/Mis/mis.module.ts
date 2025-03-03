import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RepositoryModule } from '../../repositories/repository.module';
import { JwtModule } from '@nestjs/jwt';
import { MisController } from './mis.controller';
import { MisService } from './mis.service';

@Module({
  imports: [ConfigModule, RepositoryModule, JwtModule],
  controllers: [MisController],
  providers: [MisService],
  exports: [MisService],
})
export class MisModule {}
