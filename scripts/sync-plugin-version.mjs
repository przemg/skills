#!/usr/bin/env node
// Copies package.json's version into every plugin entry in .claude-plugin/marketplace.json.
// With --check it changes nothing and exits 1 if any entry differs.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const marketplacePath = join(repo, ".claude-plugin", "marketplace.json");

const { version } = JSON.parse(readFileSync(join(repo, "package.json"), "utf8"));
const marketplace = JSON.parse(readFileSync(marketplacePath, "utf8"));

const stale = marketplace.plugins.filter((plugin) => plugin.version !== version);

if (stale.length === 0) {
  console.log(`marketplace.json plugins are at ${version} (already in sync)`);
  process.exit(0);
}

if (process.argv.includes("--check")) {
  for (const plugin of stale) {
    console.error(`${plugin.name} is at ${plugin.version}, package.json is ${version}.`);
  }
  console.error("Run `node scripts/sync-plugin-version.mjs`.");
  process.exit(1);
}

for (const plugin of stale) {
  console.log(`${plugin.name} ${plugin.version} -> ${version}`);
  plugin.version = version;
}

writeFileSync(marketplacePath, `${JSON.stringify(marketplace, null, 2)}\n`);
