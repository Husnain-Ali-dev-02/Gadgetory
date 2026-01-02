require('dotenv').config();
const { Pool } = require('pg');

const raw = process.env.DATABASE_URL;
if (!raw) {
  console.error('No DATABASE_URL found');
  process.exit(1);
}

const u = new URL(raw);
const host = u.hostname;
const port = u.port || 5432;
const user = u.username;
const password = decodeURIComponent(u.password);
const database = u.pathname ? u.pathname.replace(/^\//, '') : undefined;

console.log({ host, port, user, database });

const pool = new Pool({
  host,
  port,
  user,
  password,
  database,
  ssl: { rejectUnauthorized: false, servername: host },
});

(async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT version()');
    console.log('Connected, version:', res.rows[0]);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('Parsed connection error:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
