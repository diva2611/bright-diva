import { readFileSync } from 'fs';
import { SequelizeStorage, Umzug } from 'umzug';
import { sequelize } from './sequelize';

export const seeder = new Umzug({
    context: sequelize.getQueryInterface(),
    create: {
        folder: 'db/seeders',
        template: (filepath) => [
            [filepath, readFileSync('db/templates/seed.template.ts').toString()],
        ],
    },
    logger: console,
    migrations: {
        glob: ['seeders/*.ts', { cwd: __dirname }],
    },
    storage: new SequelizeStorage({ sequelize, modelName: 'SequelizeData' }),
});

export type Seed = typeof seeder._types.migration;
