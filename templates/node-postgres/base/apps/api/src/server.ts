import { pino } from 'pino';
import { buildApp } from './app.ts';
import { createDb, migrate } from './db/index.ts';
import { EnvSchema } from './env.ts';
import { parseEnvOrExit } from './validate.ts';

const env = parseEnvOrExit(EnvSchema, process.env);

const logger = pino({ level: env.LOG_LEVEL });
const db = createDb(env.DATABASE_URL);
await migrate(db);
const app = await buildApp({ db, logger });

const close = async () => {
  await app.close();
  await db.destroy();
  process.exit(0);
};
process.on('SIGINT', close);
process.on('SIGTERM', close);

await app.listen({ host: env.HOST, port: env.PORT });
