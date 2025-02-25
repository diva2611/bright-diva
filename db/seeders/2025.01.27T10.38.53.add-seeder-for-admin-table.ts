import { Seed } from '../umzug.seeder';
import * as bcrypt from 'bcrypt';

export const up: Seed = async ({ context: queryInterface }) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const EXECUTIVE_EMAIL = process.env.EXECUTIVE_EMAIL;
  const EXECUTIVE_PASSWORD = process.env.EXECUTIVE_PASSWORD;

  if (
    !ADMIN_EMAIL ||
    !ADMIN_PASSWORD ||
    !EXECUTIVE_EMAIL ||
    !EXECUTIVE_PASSWORD
  ) {
    throw new Error('Required environment variables are missing.');
  }

  const hashedAdminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const hashedExecutivePassword = await bcrypt.hash(EXECUTIVE_PASSWORD, 10);

  return queryInterface.sequelize.transaction((transaction) => {
    return queryInterface.bulkInsert(
      'admin',
      [
        {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'John Doe',
          username: 'john1234',
          email_id: ADMIN_EMAIL,
          password: hashedAdminPassword,
          role: 'Admin',
          phone_no: '1234567890',
          token: null,
          created_at: new Date(),
          updated_at: null,
          created_by: null,
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          name: 'Jane Executive',
          username: 'jane1234',
          email_id: EXECUTIVE_EMAIL,
          password: hashedExecutivePassword,
          role: 'Executive',
          phone_no: '0987654321',
          token: null,
          created_at: new Date(),
          updated_at: null,
          created_by: null,
        },
      ],
      { transaction },
    );
  });
};

export const down: Seed = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction((transaction) => {
    return queryInterface.bulkDelete(
      'admin',
      {
        email_id: [process.env.ADMIN_EMAIL, process.env.EXECUTIVE_EMAIL],
      },
      { transaction },
    );
  });
};
