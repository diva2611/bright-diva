import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    // Add the `customer_id` column
    await queryInterface.addColumn(
      'order',
      'customer_id',
      {
        type: DataTypes.UUID,
        allowNull: true,
      },
      { transaction },
    );

    await queryInterface.addColumn(
      'order',
      'order_number',
      {
        type: DataTypes.STRING,
        allowNull: false,
      },
      { transaction },
    );

    // Add a foreign key constraint on `customer_id`
    await queryInterface.addConstraint('order', {
      fields: ['customer_id'],
      type: 'foreign key',
      name: 'fk_order_customer_id',
      references: {
        table: 'customer',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      transaction,
    });
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('order', 'fk_order_customer_id', {
      transaction,
    });

    // Remove the `customer_id` column
    await queryInterface.removeColumn('order', 'customer_id', { transaction });

    await queryInterface.removeColumn('order', 'order_number', { transaction });
  });
};
