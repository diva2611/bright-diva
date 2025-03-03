import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.addColumn(
      'invoice',
      'expected_payment_date',
      {
        type: DataTypes.DATE,
        allowNull: true,
      },
      { transaction },
    );
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeColumn('invoice', 'expected_payment_date', {
      transaction,
    });
  });
};
