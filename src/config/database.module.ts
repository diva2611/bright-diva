import { InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

interface DatabaseConfig {
    DIALECT: Dialect;
    HOST: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
    NAME: string;
}
@Module({
    imports: [
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService<Record<string, DatabaseConfig>>) => {
                const database = configService.get<DatabaseConfig>('DATABASE');
                if (!database) {
                    throw new InternalServerErrorException('Database config not provided');
                }
                return {
                    autoLoadModels: true,
                    database: database.NAME,
                    define: {
                        timestamps: false,
                    },
                    dialect: database.DIALECT,
                    host: database.HOST,
                    logging: false,
                    password: database.PASSWORD,
                    pool: {
                        max: 32,
                        min: 0,
                    },
                    port: database.PORT,
                    username: database.USERNAME,
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
