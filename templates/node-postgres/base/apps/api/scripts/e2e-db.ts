// Gives an e2e run a fresh, empty database on the Postgres in the given URL: drops and
// recreates <database>_e2e there, then prints its URL. The URL's role needs CREATEDB.
import pg from 'pg';

const url = new URL(process.argv[2] ?? '');
const e2e = new URL(url);
e2e.pathname = `${url.pathname.slice(1)}_e2e`;
const name = pg.escapeIdentifier(e2e.pathname.slice(1));

const client = new pg.Client({ connectionString: url.href });
try {
  await client.connect();
} catch (error) {
  console.error(`e2e-db: can't reach Postgres at ${url.host}. Start one and set its URL in .env.`);
  throw error;
}
try {
  await client.query(`DROP DATABASE IF EXISTS ${name} WITH (FORCE)`);
  await client.query(`CREATE DATABASE ${name}`);
} finally {
  await client.end();
}
console.log(e2e.href);
