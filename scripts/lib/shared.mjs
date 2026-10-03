// Shared by link-skill.mjs and unlink-skill.mjs.

import { execFileSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const repo = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const fail = (message) => {
  console.error(message);
  process.exit(1);
};

// Skill name -> absolute path, for every skills/<plugin>/<skill>/SKILL.md.
export const findSkills = () => {
  const skills = new Map();
  const subdirectories = (path) =>
    readdirSync(path, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  for (const plugin of subdirectories(join(repo, "skills"))) {
    const pluginPath = join(repo, "skills", plugin.name);
    for (const skill of subdirectories(pluginPath)) {
      if (existsSync(join(pluginPath, skill.name, "SKILL.md"))) {
        skills.set(skill.name, join(pluginPath, skill.name));
      }
    }
  }
  return skills;
};

// npm runs scripts from the repo root, so a relative target means relative to where npm was called.
export const resolveTarget = (argument) => {
  if (!argument) return undefined;
  const target = resolve(process.env.INIT_CWD ?? process.cwd(), argument);
  if (!existsSync(target) || !statSync(target).isDirectory()) fail(`${target} is not a directory.`);
  return target;
};

export const skillsDirectory = (target) => join(target, ".claude", "skills");

// True only for a symlink or junction whose target lies inside this repo, even if that target is gone.
export const pointsIntoRepo = (path) => {
  if (!lstatSync(path, { throwIfNoEntry: false })?.isSymbolicLink()) return false;
  // Windows reports junction targets with a \\?\ prefix.
  const linkTarget = resolve(dirname(path), readlinkSync(path).replace(/^\\\\\?\\/, ""));
  const fromRepo = relative(repo, linkTarget);
  return fromRepo !== "" && !fromRepo.startsWith("..") && !isAbsolute(fromRepo);
};

export const linkedSkills = (target) => {
  const directory = skillsDirectory(target);
  if (!existsSync(directory)) return [];
  return readdirSync(directory).filter((name) => pointsIntoRepo(join(directory, name)));
};

// Resolves the exclude file and the entry for one skill, or undefined when the target isn't in a git repo.
// --show-prefix makes the entry correct when the target is a subdirectory of its repo.
const excludeEntry = (target, name) => {
  const git = (...args) =>
    execFileSync("git", ["-C", target, "rev-parse", ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  try {
    return {
      file: resolve(target, git("--git-path", "info/exclude")),
      line: `/${git("--show-prefix")}.claude/skills/${name}`,
    };
  } catch {
    return undefined;
  }
};

const readLines = (file) => {
  if (!existsSync(file)) return [];
  const text = readFileSync(file, "utf8").replace(/\r?\n$/, "");
  return text === "" ? [] : text.split(/\r?\n/);
};

// Keeps the link out of the target's `git status` without touching any file it commits.
export const addExclude = (target, name) => {
  const exclude = excludeEntry(target, name);
  if (!exclude) {
    console.log(`${target} is not a git repo, so ${name} was not added to .git/info/exclude.`);
    return;
  }
  const lines = readLines(exclude.file);
  if (lines.includes(exclude.line)) return;
  mkdirSync(dirname(exclude.file), { recursive: true });
  writeFileSync(exclude.file, `${[...lines, exclude.line].join("\n")}\n`);
};

export const removeExclude = (target, name) => {
  const exclude = excludeEntry(target, name);
  if (!exclude || !existsSync(exclude.file)) return;
  const lines = readLines(exclude.file);
  if (!lines.includes(exclude.line)) return;
  const kept = lines.filter((line) => line !== exclude.line);
  writeFileSync(exclude.file, kept.length > 0 ? `${kept.join("\n")}\n` : "");
};
