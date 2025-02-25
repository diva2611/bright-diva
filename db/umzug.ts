import { SequelizeStorage, Umzug } from 'umzug';
import { sequelize } from './sequelize';

export const migrator = new Umzug({
    context: sequelize.getQueryInterface(),
    create: {
        folder: 'db/migrations',
    },
    logger: console,
    migrations: {
        glob: ['migrations/*.ts', { cwd: __dirname }],
    },
    storage: new SequelizeStorage({ sequelize }),
});

export type Migration = typeof migrator._types.migration;
