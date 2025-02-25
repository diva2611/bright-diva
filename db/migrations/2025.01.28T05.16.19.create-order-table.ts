import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'order',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        invoice_number: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        partial_delivery: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        amount_of_delivery: {
          type: DataTypes.DECIMAL(64, 20),
          allowNull: false,
        },
        currency: {
          type: DataTypes.ENUM('MOP', 'HKD', 'CNY'),
          allowNull: false,
          defaultValue: 'HKD',
        },
        amount_in_hkd: {
          type: DataTypes.DECIMAL(64, 20),
          allowNull: false,
        },
        delivered_units: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        created_by: {
          type: DataTypes.UUID,
          allowNull: true,
        },
      },
      { transaction },
    );

    await queryInterface.addConstraint('invoice', {
      fields: ['invoice_number'],
      type: 'unique',
      name: 'unique_invoice_number',
      transaction,
    });

    await queryInterface.addConstraint('order', {
      fields: ['invoice_number'],
      type: 'foreign key',
      name: 'fk_order_invoice_number',
      references: {
        table: 'invoice',
        field: 'invoice_number',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });

    await queryInterface.addConstraint('order', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_order_created_by',
      references: {
        table: 'admin',
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
    await queryInterface.removeConstraint('order', 'fk_order_invoice_number', {
      transaction,
    });
    await queryInterface.removeConstraint('order', 'fk_order_created_by', {
      transaction,
    });
    await queryInterface.dropTable('order', { transaction });
  });
};
