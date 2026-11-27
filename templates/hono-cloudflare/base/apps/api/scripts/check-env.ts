// Runs before `wrangler dev`: refuses to start on a missing or bad value in .env.
// Bindings (database) are checked by the Worker itself on its first request.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { VarsSchema } from '../src/env.ts';
import { parseEnvOrExit } from '../src/validate.ts';

const file = join(import.meta.dirname, '../../../.env');
if (existsSync(file)) process.loadEnvFile(file);
parseEnvOrExit(VarsSchema, process.env);
