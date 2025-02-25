import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModelsModule } from './models/models.module';
import configuration from './config/app.config';
import { validate } from './config/env.validation';
import { DatabaseModule } from './config';
import { RepositoryModule } from './repositories/repository.module';
import { APIModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    DatabaseModule,
    ModelsModule,
    RepositoryModule,
    APIModule,
  ],
})
export class AppModule {}
