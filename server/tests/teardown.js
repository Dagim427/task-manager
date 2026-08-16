export default async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { pool } = await import('../src/config/database.js');

  if (pool && typeof pool.end === 'function') {
    await pool.end();
  }
};