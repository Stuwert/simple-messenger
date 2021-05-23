import knexInstance from "./knexInstance";

export default async function teardown() {
  await knexInstance.destroy();
}
