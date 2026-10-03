#!/usr/bin/env node
// Local release: applies pending changesets, syncs the version into marketplace.json,
// commits, tags and pushes. Run from a clean main with at least one changeset.

import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");

const fail = (message) => {
  console.error(message);
  process.exit(1);
};
const run = (command) => {
  try {
    execSync(command, { cwd: repo, stdio: "inherit" });
  } catch {
    fail(`\`${command}\` failed. Fix it and finish the remaining steps by hand.`);
  }
};
const output = (command) => execSync(command, { cwd: repo, encoding: "utf8" }).trim();
const readVersion = () => JSON.parse(readFileSync(join(repo, "package.json"), "utf8")).version;

const branch = output("git rev-parse --abbrev-ref HEAD");
if (branch !== "main") fail(`Release from main, not ${branch}.`);
if (output("git status --porcelain")) fail("Working tree is not clean. Commit or stash first.");

const changesets = readdirSync(join(repo, ".changeset")).filter(
  (file) => file.endsWith(".md") && file !== "README.md",
);
if (changesets.length === 0) fail("No changesets to release. Run `npm run changeset` first.");

const before = readVersion();
run("npx changeset version");
run("node scripts/sync-plugin-version.mjs");
run("node scripts/sync-plugin-version.mjs --check");

// Claude Code only updates installed plugins when the version string changes.
const version = readVersion();
if (version === before) fail(`Version is still ${before} after \`changeset version\`. Nothing released.`);

run("git add -A");
run(`git commit -m "release: v${version}"`);
run("npx changeset git-tag");
run("git push --follow-tags origin main");

console.log(`Released v${version}.`);
