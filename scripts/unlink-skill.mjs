#!/usr/bin/env node
// Removes skills linked by link-skill.mjs. Only ever removes links into this repo, never real folders.
// Usage: npm run unlink-skill -- <target-project> <skill> [<skill>...]

import { lstatSync, rmSync } from "node:fs";
import { join } from "node:path";
import {
  fail,
  linkedSkills,
  pointsIntoRepo,
  removeExclude,
  resolveTarget,
  skillsDirectory,
} from "./lib/shared.mjs";

const [targetArgument, ...names] = process.argv.slice(2);

const target = resolveTarget(targetArgument);
if (!target) fail("Usage: npm run unlink-skill -- <target-project> <skill> [<skill>...]");

const linked = linkedSkills(target);
const listed = linked.length > 0 ? `Linked skills: ${linked.join(", ")}.` : `No skills are linked into ${target}.`;
if (names.length === 0) fail(`Name at least one skill to unlink.\n${listed}`);

// Check every skill before unlinking any, so a bad name doesn't leave a half-done run.
const directory = skillsDirectory(target);
for (const name of names) {
  const path = join(directory, name);
  if (!lstatSync(path, { throwIfNoEntry: false })) fail(`${name} is not linked into ${target}.\n${listed}`);
  if (!pointsIntoRepo(path)) fail(`${path} is not a link into this repo. Leaving it alone.`);
}

for (const name of names) {
  rmSync(join(directory, name));
  removeExclude(target, name);
  console.log(`Unlinked ${name} from ${target}`);
}
