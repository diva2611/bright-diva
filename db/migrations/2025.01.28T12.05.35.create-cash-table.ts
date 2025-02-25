import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'cash',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        receipt_number: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        invoice_number: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        customer_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        amount: {
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
        cash_pickup_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        pickup_time: {
          type: DataTypes.TIME,
          allowNull: false,
        },
        picked_by: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
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

    await queryInterface.addConstraint('cash', {
      fields: ['invoice_number'],
      type: 'foreign key',
      name: 'fk_cash_invoice_number',
      references: {
        table: 'invoice',
        field: 'invoice_number',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });

    await queryInterface.addConstraint('cash', {
      fields: ['customer_id'],
      type: 'foreign key',
      name: 'fk_cash_customer_id',
      references: {
        table: 'customer',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });

    await queryInterface.addConstraint('cash', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_cash_created_by',
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
    await queryInterface.removeConstraint('cash', 'fk_cash_invoice_number', {
      transaction,
    });
    await queryInterface.removeConstraint('cash', 'fk_cash_customer_id', {
      transaction,
    });
    await queryInterface.removeConstraint('cash', 'fk_cash_created_by', {
      transaction,
    });

    await queryInterface.dropTable('cash', { transaction });
  });
};
