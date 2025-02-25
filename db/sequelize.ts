import { config as dotEnv } from 'dotenv';
import { Sequelize } from 'sequelize';

dotEnv();

export const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    // eslint-disable-next-line no-console
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME,
});
