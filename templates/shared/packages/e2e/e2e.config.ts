import { anthropic } from '@ai-sdk/anthropic';
import { claudeCode } from '@e2e-dev/acp';
import { web } from '@e2e-dev/web';
import type { E2EConfig } from 'e2e';

/*
 * Agent steps (agent.act) replay from the committed cache in .e2e/cache, so the
 * pre-push hook (--strict-cache) never calls a model. A model is only called to
 * record or re-record a step (pnpm e2e:record):
 *   - default: the Anthropic API. Set ANTHROPIC_API_KEY to record (preferred:
 *     it doesn't use plan limits). Without a key, replays still work, and a step
 *     that has to call the model fails with MODEL_PROVIDER_FAILED.
 *   - E2E_AGENT=claude-code: the local Claude Code login, over ACP.
 */
const defaultAgent =
  process.env.E2E_AGENT === 'claude-code'
    ? { executor: claudeCode({ model: 'sonnet' }) }
    : { model: anthropic(process.env.E2E_MODEL ?? 'claude-sonnet-5-5') };

export default {
  // Fixed ids (not the project name) key the replay cache, so the recording
  // agent-kit ships with replays in every project scaffolded from it.
  projectId: 'agent-kit-app',
  tests: ['tests/**/*.e2e.ts'],
  agents: { default: defaultAgent },
  targets: [
    {
      name: 'web',
      engine: web({ viewport: { width: 1280, height: 800 } }),
      app: {
        // Port 0: the runner picks a free port and passes it to serve.sh.
        url: 'http://127.0.0.1:0',
        identity: 'web',
        command: {
          executable: './scripts/serve.sh',
          args: ['{port}'],
          log: '.e2e/logs/app.log',
          inheritEnv: ['DOCKER_*', 'XDG_*'],
          startupTimeout: 120_000,
        },
      },
    },
  ],
  // Tests share one database, reset by serve.sh at the start of each run.
  workers: 1,
  cache: { dir: '.e2e/cache' },
  timeout: 120_000,
  video: 'retain-on-failure',
} satisfies E2EConfig;
