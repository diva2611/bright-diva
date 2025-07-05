import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RepositoryModule } from '../../repositories/repository.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [ConfigModule, RepositoryModule, JwtModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
