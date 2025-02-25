import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'currency',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        base_currency: {
          type: DataTypes.STRING(10),
          allowNull: false,
          unique: true,
        },
        hkd_to_mop: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        hkd_to_cny: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        created_by: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        updated_by: {
          type: DataTypes.UUID,
          allowNull: true,
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
      },
      { transaction }
    );

    await queryInterface.addConstraint('currency', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_currency_created_by',
      references: {
        table: 'admin',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });

    await queryInterface.addConstraint('currency', {
      fields: ['updated_by'],
      type: 'foreign key',
      name: 'fk_currency_updated_by',
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
    await queryInterface.removeConstraint('currency', 'fk_currency_created_by', { transaction });
    await queryInterface.removeConstraint('currency', 'fk_currency_updated_by', { transaction });
    await queryInterface.dropTable('currency', { transaction });
  });
};
