import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../src/config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const connection = await pool.getConnection();

  try {
    console.log("Running migrations...");

    // 1. Create migrations table if missing
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_migrations_name (name)
      );
    `);

    // 2. Read migration files
    const migrationsDir = path.join(__dirname, "../migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.log("No migrations directory found.");
      return;
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort(); // Ensures deterministic execution order

    // 3. Check which ones already ran
    const [rows] = await connection.execute("SELECT name FROM migrations");
    const executedMigrations = new Set(rows.map((row) => row.name));

    let executedCount = 0;

    // 4. Run pending migrations
    for (const file of files) {
      if (!executedMigrations.has(file)) {
        const filePath = path.join(migrationsDir, file);
        const sqlQuery = fs.readFileSync(filePath, "utf8");

        await connection.beginTransaction();

        try {
          // Execute migration query
          await connection.query(sqlQuery);

          // Record successful migration
          await connection.execute(
            "INSERT INTO migrations (name) VALUES (?)",
            [file]
          );

          await connection.commit();
          console.log(`✓ ${file}`);
          executedCount++;
        } catch (err) {
          await connection.rollback();

          // Handle case where table already exists safely
          if (err.code === "ER_TABLE_EXISTS_ERROR") {
            console.warn(`⚠️ Table already exists for ${file}. Marking as executed.`);
            await connection.execute(
              "INSERT IGNORE INTO migrations (name) VALUES (?)",
              [file]
            );
          } else {
            throw err;
          }
        }
      }
    }

    if (executedCount === 0) {
      console.log("No pending migrations.");
    } else {
      console.log("Migrations complete.");
    }
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    connection.release();
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });