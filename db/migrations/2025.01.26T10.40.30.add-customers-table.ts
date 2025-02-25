import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'customer',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING(500),
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        contact_person_name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        mobile_number: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        email_id: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        business_registration_number: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        created_by: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      { transaction }
    );

    await queryInterface.addConstraint('customer', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_customer_created_by',
      references: {
        table: 'admin',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeConstraint('customer', 'fk_customer_created_by', {
      transaction,
    });
    await queryInterface.dropTable('customer', { transaction });
  });
};
