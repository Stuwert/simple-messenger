import knex from "knex";
import config from "./knexfile";

export default require("knex")(config);
