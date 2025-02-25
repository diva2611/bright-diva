import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'invoice',
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
          unique: true,
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
        total_units: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        invoice_date: {
          type: DataTypes.DATE,
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
      fields: ['customer_id'],
      type: 'foreign key',
      name: 'fk_invoice_customer_id',
      references: {
        table: 'customer',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });

    await queryInterface.changeColumn(
      'invoice',
      'created_by',
      {
        type: DataTypes.UUID,
        allowNull: true,
      },
      { transaction }
    );
    

    await queryInterface.addConstraint('invoice', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_invoice_created_by',
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

