import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.addColumn(
      'order',
      'delivered_by',
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
      { transaction },
    );
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeColumn('order', 'delivered_by', {
      transaction,
    });
  });
};
