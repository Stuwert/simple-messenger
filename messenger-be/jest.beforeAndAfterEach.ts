import knex from "./knexInstance";

/**
 * This file will wipe out your db
 * on each run.
 *
 * SO DONT DO IT ON PRODUCTTION
 *
 * If this were a live app I'd specific a
 * different knexfile for tests. But that seems
 * like a lot of overhead to write some simple tests
 * to validate the service.
 *
 * I'm deleting here to make sure that database
 * records don't get polluted between each test run.
 *
 */

afterEach(async () => {
  await knex("users").del();
});
