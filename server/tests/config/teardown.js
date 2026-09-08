// tests/config/teardown.js (or wherever your global teardown is located)
import { closeDatabase } from "../helpers/database.js";

export default async () => {
  await closeDatabase();
};
