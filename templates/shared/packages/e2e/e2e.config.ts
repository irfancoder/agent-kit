import { claudeCode } from '@e2e-dev/acp';
import { web } from '@e2e-dev/web';
import type { E2EConfig } from 'e2e';

/*
 * Agent steps (agent.act) replay from the committed cache in .e2e/cache, so the
 * pre-push hook (--strict-cache) never starts an agent. Recording a step
 * (pnpm e2e:record) runs it on Claude Code over ACP, signed in with your `claude`
 * login (the Claude Max plan). ANTHROPIC_API_KEY is blanked for the agent so a key
 * in the environment never takes over from the login and bills the API instead.
 */
const defaultAgent = {
  executor: claudeCode({ model: 'sonnet', env: { ANTHROPIC_API_KEY: '' } }),
};

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
