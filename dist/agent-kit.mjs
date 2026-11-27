#!/usr/bin/env node

// src/checks.ts
import { existsSync, readdirSync, readFileSync as readFileSync2 } from "node:fs";
import { join as join2 } from "node:path";

// src/util.ts
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
var KIT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
var KIT_VERSION = JSON.parse(readFileSync(join(KIT_DIR, "package.json"), "utf8")).version;
var E2E_CACHE = join("packages", "e2e", ".e2e", "cache");
var KitError = class extends Error {
};
function fail(message) {
  throw new KitError(message);
}
function warn(message) {
  console.error(`agent-kit: warning: ${message}`);
}
function step(message) {
  console.log(`==> ${message}`);
}
function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { stdio: "inherit", ...options });
  if (result.error) fail(`${cmd} couldn't start: ${result.error.message}`);
  if (result.status !== 0) fail(`${cmd} ${args.join(" ")} failed (exit ${result.status})`);
}
function output(cmd, args) {
  const result = spawnSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return result.status === 0 ? String(result.stdout).trim() : null;
}

// src/checks.ts
function layers(o) {
  return [
    join2(KIT_DIR, "templates/shared"),
    join2(KIT_DIR, "templates", o.variant, "base"),
    ...o.db ? [join2(KIT_DIR, "templates", o.variant, `db-${o.db}`)] : []
  ];
}
function majorMinor(version) {
  const [, major = "0", minor = "0"] = /(\d+)(?:\.(\d+))?/.exec(version) ?? [];
  return [Number(major), Number(minor)];
}
function checkMachine(o) {
  if (existsSync(o.dir)) fail(`${o.dir} already exists`);
  if (output("git", ["--version"]) === null) fail("git is not installed");
  const pkg = JSON.parse(readFileSync2(join2(KIT_DIR, "templates/shared/package.json"), "utf8"));
  const [needMajor, needMinor] = majorMinor(pkg.engines.node);
  const [major, minor] = majorMinor(process.versions.node);
  if (major < needMajor || major === needMajor && minor < needMinor)
    fail(`Node.js ${pkg.engines.node} is needed (found ${process.version})`);
  const pnpm = output("pnpm", ["--version"]) ?? fail("pnpm is not installed");
  const [pnpmMajor] = majorMinor(pkg.packageManager);
  if (majorMinor(pnpm)[0] !== pnpmMajor) fail(`pnpm ${pnpmMajor} is needed (found ${pnpm})`);
  if (layers(o).some((layer) => existsSync(join2(layer, "docker-compose.yml"))) && output("docker", ["info"]) === null)
    fail("Docker isn't running (the project's database needs it)");
  if (o.github) {
    o.owner ??= output("gh", ["api", "user", "-q", ".login"]) ?? fail("gh isn't installed or signed in (gh auth login)");
    if (output("gh", ["repo", "view", `${o.owner}/${o.name}`]) !== null) fail(`github.com/${o.owner}/${o.name} already exists`);
    if (!readdirSync(join2(KIT_DIR, "templates/shared", E2E_CACHE)).some((f) => f.endsWith(".json")))
      fail("agent-kit's e2e replay cache isn't recorded yet, so the first push would fail (irfancoder/agent-kit#1)");
  }
  if (!/"loggedIn":\s*true/.test(output("claude", ["auth", "status"]) ?? ""))
    warn("Claude Code isn't signed in; the Builder can't record e2e steps until you run `claude` and sign in");
}

// src/github.ts
var PLAN_ISSUE = `Read \`AGENTS.md\`, then plan the project from \`.agent/BRIEF.md\`: \`GOAL.md\`, \`SPEC.md\` and \`feature_list.json\`.

Then open the issues the team works from, each labelled \`ready\` once nothing it depends on is still open: the design-language ticket first, then one per feature. For a question only the owner can answer, comment here with your recommendation and add \`needs-decision\`.`;
function publish(o) {
  const here = { cwd: o.dir };
  step("Installing the e2e browser for the pre-push hook (cached per machine)");
  run("pnpm", ["--dir", "packages/e2e", "exec", "e2e-web", "install", "chromium"], { ...here, stdio: ["ignore", "ignore", "inherit"] });
  const slug = `${o.owner}/${o.name}`;
  step(`Creating github.com/${slug}`);
  run("gh", ["repo", "create", slug, "--private", "--source", ".", "--remote", "origin", "--push"], here);
  for (const [label, color, description] of [
    ["ready", "0e8a16", "Can be picked up now"],
    ["needs-decision", "d93f0b", "Waiting on the owner"]
  ]) {
    run("gh", ["label", "create", label, "--repo", slug, "--color", color, "--description", description, "--force"], {
      stdio: "ignore"
    });
  }
  const repo = `https://github.com/${slug}`;
  const issue = output("gh", ["issue", "create", "--repo", slug, "--label", "ready", "--title", "Plan the project from the brief", "--body", PLAN_ISSUE]) ?? fail(`the repo was created (${repo}) but the Planner's issue wasn't`);
  return { repo, issue };
}

// src/options.ts
import { readFileSync as readFileSync3 } from "node:fs";
import { homedir } from "node:os";
import { basename, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
var USAGE = `agent-kit [dir] [options]

Creates a project in IRFANCODER's stack, ready for an agent team.

  --name <name>            Project name in kebab-case (defaults to the folder name)
  --title <title>          Display name (defaults to the name in Title Case)
  --variant <variant>      node-postgres (default) or hono-cloudflare
  --db <db>                hono-cloudflare only: hyperdrive (default) or d1
  --brief-file <path|->    The owner's brief, word for word, for .agent/BRIEF.md ("-": stdin)
  --reason <text>          Why this variant, logged in .agent/DECISIONS.md
  --github                 Create the private GitHub repo, push, and open the Planner's issue
  --owner <owner>          GitHub owner for --github (default: the signed-in gh user)
  --check                  Check the options and the machine, then stop
  -y, --yes                Don't ask: use the defaults for anything not given
  -h, --help               Show this

[dir] defaults to ./<name>. Anything not given is asked for, unless --yes is set or
nobody is at a terminal (a bot, CI). The last lines printed are PROJECT_DIR=,
PROJECT_REPO= and PROJECT_ISSUE=.`;
var NAME = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
function titleFromName(name) {
  return name.replace(/(^|-)([a-z0-9])/g, (_, dash, c) => (dash ? " " : "") + c.toUpperCase());
}
function validate(o) {
  if (!NAME.test(o.name)) fail("--name must be kebab-case (for example budget-tracker)");
  if (o.name === "kitapp") fail("--name can't be the template placeholder 'kitapp'");
  if (o.name.length > 50) fail("--name must be 50 characters or fewer");
  if (/['"\\\n]/.test(o.title)) fail("--title can't contain quotes, backslashes or newlines");
  if (o.variant !== "node-postgres" && o.variant !== "hono-cloudflare")
    fail("--variant must be node-postgres or hono-cloudflare");
  if (o.variant === "node-postgres" && o.db) fail("--db only applies to --variant hono-cloudflare");
  if (o.variant === "hono-cloudflare") {
    o.db ??= "hyperdrive";
    if (o.db !== "hyperdrive" && o.db !== "d1") fail("--db must be hyperdrive or d1");
  }
  if (o.brief !== void 0 && !o.brief.trim()) fail("the brief is empty");
  return o;
}
function readBrief(path) {
  try {
    return readFileSync3(path === "-" ? 0 : path, "utf8");
  } catch {
    return fail(`can't read the brief from ${path === "-" ? "stdin" : path}`);
  }
}
async function getOptions(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      name: { type: "string" },
      title: { type: "string" },
      variant: { type: "string" },
      db: { type: "string" },
      "brief-file": { type: "string" },
      reason: { type: "string" },
      github: { type: "boolean", default: false },
      owner: { type: "string" },
      check: { type: "boolean", default: false },
      yes: { type: "boolean", short: "y", default: false },
      help: { type: "boolean", short: "h", default: false }
    }
  });
  if (values.help) {
    console.log(USAGE);
    return null;
  }
  if (positionals.length > 1) fail("only one [dir] is allowed");
  const briefFile = values["brief-file"];
  const interactive = !values.yes && briefFile !== "-" && process.stdin.isTTY && process.stdout.isTTY;
  let dirArg = positionals[0];
  let name = values.name ?? (dirArg ? basename(resolve(dirArg)) : void 0);
  let title = values.title;
  let variant = values.variant;
  let db = values.db;
  let brief = briefFile ? readBrief(briefFile) : void 0;
  let github = values.github;
  if (interactive) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const ask = async (question, fallback) => (await rl.question(fallback ? `${question} (${fallback}) ` : `${question} `)).trim() || fallback || "";
    try {
      name ??= await ask("Project name, kebab-case:");
      title ??= await ask("Display name:", titleFromName(name));
      variant ??= await ask("Variant, node-postgres or hono-cloudflare:", "node-postgres");
      if (variant === "hono-cloudflare") db ??= await ask("Database, hyperdrive or d1:", "hyperdrive");
      dirArg ??= await ask("Folder:", `./${name}`);
      if (!briefFile) {
        const path = await ask("Path to the owner's brief (blank to add it later):");
        if (path) brief = readBrief(path);
      }
      github ||= /^y/i.test(await ask("Create the private GitHub repo and push? y/N", "N"));
    } finally {
      rl.close();
    }
  }
  if (!name) fail("pass a [dir] or --name");
  return validate({
    // The shell expands ~ in arguments; a typed answer needs it done here.
    dir: resolve((dirArg ?? `./${name}`).replace(/^~(?=\/|$)/, homedir())),
    name,
    title: title || titleFromName(name),
    variant: variant ?? "node-postgres",
    db,
    brief,
    reason: values.reason,
    github,
    owner: values.owner,
    check: values.check
  });
}

// src/scaffold.ts
import {
  appendFileSync,
  chmodSync,
  copyFileSync,
  cpSync,
  mkdirSync,
  readdirSync as readdirSync2,
  readFileSync as readFileSync4,
  renameSync,
  writeFileSync
} from "node:fs";
import { basename as basename2, join as join3, relative, sep } from "node:path";
var SKIP = /* @__PURE__ */ new Set(["node_modules", ".turbo", "dist"]);
function copyTemplates(o) {
  mkdirSync(o.dir, { recursive: true });
  for (const layer of layers(o)) {
    cpSync(layer, o.dir, { recursive: true, filter: (src) => !SKIP.has(basename2(src)) });
  }
  const entries = readdirSync2(o.dir, { recursive: true, withFileTypes: true }).map((entry) => ({ path: join3(entry.parentPath, entry.name), isDir: entry.isDirectory() })).filter(({ path }) => !relative(o.dir, path).startsWith(E2E_CACHE)).sort((a, b) => b.path.split(sep).length - a.path.split(sep).length);
  for (const { path, isDir } of entries) {
    const name = basename2(path);
    if (!isDir) {
      const buffer = readFileSync4(path);
      const text = buffer.includes(0) ? "" : buffer.toString("utf8");
      if (text.includes("kitapp") || text.includes("Kit App")) {
        writeFileSync(path, text.replaceAll("Kit App", o.title).replaceAll("kitapp", o.name));
      }
      if (name.endsWith(".sh")) chmodSync(path, 493);
    }
    const renamed = name === "_gitignore" ? ".gitignore" : name.replaceAll("kitapp", o.name);
    if (renamed !== name) renameSync(path, join3(path, "..", renamed));
  }
}
function recordBrief(o) {
  if (o.brief === void 0) return;
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const agent = join3(o.dir, ".agent");
  writeFileSync(
    join3(agent, "BRIEF.md"),
    `# Brief

<!-- The owner's brief, word for word. Received ${today}. -->

${o.brief}`
  );
  const variant = o.db ? `${o.variant} with ${o.db}` : o.variant;
  appendFileSync(join3(agent, "DECISIONS.md"), `${today} \u2014 variant: ${variant} \u2014 ${o.reason ?? "the default"}
`);
  appendFileSync(
    join3(agent, "PROGRESS.md"),
    `${today} | lead | kickstart | scaffolded via agent-kit ${KIT_VERSION} with the brief | Planner: GOAL, SPEC and feature list
`
  );
}
function scaffold(o) {
  step(`Scaffolding ${o.name} (${o.variant}${o.db ? `, ${o.db}` : ""}) into ${o.dir}`);
  copyTemplates(o);
  copyFileSync(join3(o.dir, ".env.example"), join3(o.dir, ".env"));
  recordBrief(o);
  const here = { cwd: o.dir };
  run("git", ["init", "-q", "-b", "main"], here);
  run("pnpm", ["install"], here);
  run("pnpm", ["exec", "oxfmt"], { ...here, stdio: ["ignore", "ignore", "inherit"] });
  run("git", ["add", "-A"], here);
  run("git", ["commit", "-q", "-m", `chore: scaffold via agent-kit ${KIT_VERSION}`], here);
}

// src/index.ts
async function main() {
  const o = await getOptions(process.argv.slice(2));
  if (!o) return;
  step("Checking the machine");
  checkMachine(o);
  if (o.check) return;
  scaffold(o);
  const { repo, issue } = o.github ? publish(o) : { repo: "", issue: "" };
  console.log(`
Done: ${o.dir} (${o.title})`);
  if (!o.github) console.log(`Next: cd ${o.dir} && ./.agent/init.sh, then read AGENTS.md.`);
  console.log(`
PROJECT_DIR=${o.dir}
PROJECT_REPO=${repo}
PROJECT_ISSUE=${issue}`);
}
main().catch((error) => {
  console.error(`agent-kit: ${error instanceof KitError ? error.message : String(error)}`);
  process.exit(1);
});
