import { Seed } from '../umzug.seeder';

export const up: Seed = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction((transaction) => {
    return queryInterface.bulkInsert(
      'currency',
      [
        {
          id: '00000000-0000-0000-0000-000000000011',
          base_currency: 'HKD',
          hkd_to_mop: 1.03,
          hkd_to_cny: 0.92,
          created_by: '00000000-0000-0000-0000-000000000001',
          created_at: new Date(),
        },
      ],
      { transaction },
    );
  });
};

export const down: Seed = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction((transaction) => {
    return queryInterface.bulkDelete('currency', {}, { transaction });
  });
};
