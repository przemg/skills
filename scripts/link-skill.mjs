#!/usr/bin/env node
// Links skills from this repo into another project's .claude/skills, so they can be tried there
// without releasing a new version. Edits here show up in that project straight away.
// Usage: npm run link-skill -- <target-project> <skill> [<skill>...]

import { lstatSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import {
  addExclude,
  fail,
  findSkills,
  pointsIntoRepo,
  resolveTarget,
  skillsDirectory,
} from "./lib/shared.mjs";

const [targetArgument, ...names] = process.argv.slice(2);
const skills = findSkills();
const available = `Available skills: ${[...skills.keys()].join(", ")}.`;

const target = resolveTarget(targetArgument);
if (!target) fail(`Usage: npm run link-skill -- <target-project> <skill> [<skill>...]\n${available}`);
if (names.length === 0) fail(`Name at least one skill to link.\n${available}`);

// Check every skill before linking any, so a bad name doesn't leave a half-done run.
const directory = skillsDirectory(target);
for (const name of names) {
  if (!skills.has(name)) fail(`No skill named ${name}.\n${available}`);
  const path = join(directory, name);
  if (lstatSync(path, { throwIfNoEntry: false }) && !pointsIntoRepo(path)) {
    fail(`${path} already exists and is not a link into this repo. Remove it yourself if it can go.`);
  }
}

mkdirSync(directory, { recursive: true });
for (const name of names) {
  const path = join(directory, name);
  // An earlier link into this repo, possibly stale after a rename; safe to replace.
  if (lstatSync(path, { throwIfNoEntry: false })) rmSync(path);
  // "junction" needs no admin rights on Windows; other platforms ignore it and make a symlink.
  symlinkSync(skills.get(name), path, "junction");
  addExclude(target, name);
  console.log(`Linked ${name} -> ${path}`);
}
