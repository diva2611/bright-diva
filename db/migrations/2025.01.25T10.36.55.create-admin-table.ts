import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'admin',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING(100),
          unique: true,
          allowNull: false,
        },
        email_id: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('Executive', 'Admin'),
          allowNull: false,
        },
        phone_no: {
          type: DataTypes.STRING(15),
          allowNull: false,
        },
        token: {
          type: DataTypes.STRING(500),
          allowNull: true,
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
      { transaction }
    );

    await queryInterface.addConstraint('admin', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_admin_created_by',
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
    await queryInterface.removeConstraint('admin', 'fk_admin_created_by', {
      transaction,
    });
    await queryInterface.dropTable('admin', { transaction });
  });
};
