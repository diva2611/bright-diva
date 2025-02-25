export default () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.APP_PORT || '3000', 10) || 3000,

  DATABASE: {
    DIALECT: process.env.DATABASE_DIALECT,
    HOST: process.env.DATABASE_HOST,
    NAME: process.env.DATABASE_NAME,
    PASSWORD: process.env.DATABASE_PASSWORD,
    PORT: parseInt(process.env.DATABASE_PORT || '5432', 10),
    USERNAME: process.env.DATABASE_USERNAME,
  },
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  },
});
