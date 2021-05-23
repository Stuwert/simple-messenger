require("dotenv").config();
export default {
  client: "pg",
  connection: process.env.DATABASE_URL || {
    host: process.env.LOCAL_DB_HOST,
    database: process.env.LOCAL_DB_NAME,
    user: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PW,
  },
  migrations: {
    tableName: "migrations",
  },
};
