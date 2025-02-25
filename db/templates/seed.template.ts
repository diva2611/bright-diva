import { Seed } from '../umzug.seeder';

export const up: Seed = async ({ context: queryInterface }) => {
    return queryInterface.sequelize.transaction((transaction) => {
        return queryInterface.bulkInsert(
            'table_name',
            [
                {
                    field_name: 'field value',
                },
            ],
            { transaction },
        );
    });
};

export const down: Seed = async ({ context: queryInterface }) => {
    return queryInterface.sequelize.transaction((transaction) => {
        return queryInterface.bulkDelete('table_name', {}, { transaction });
    });
};
