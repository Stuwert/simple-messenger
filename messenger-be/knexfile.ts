export default {
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "messenger",
    password: "messenger",
    database: "simple_messaging_app",
  },
  migrations: {
    tableName: "migrations",
  },
};
