export default {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: "migrations",
  },
};
