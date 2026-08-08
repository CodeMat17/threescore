#!/usr/bin/env node
/**
 * Mirrors the Convex backend from the dashboard repo (the single source of
 * truth) into this repo.
 *
 * This app never defines or deploys Convex functions. It only *calls* them, and
 * it needs the function sources on disk because `convex/_generated/api.d.ts`
 * imports types from them (`import type * as blog from "../blog.js"`). Without
 * the mirror the frontend loses all Convex type safety.
 *
 *   yarn convex:sync     refresh the mirror from the dashboard repo
 *   yarn convex:check    fail if the mirror has drifted (run in CI / prebuild)
 *
 * Point at a dashboard checkout elsewhere with CONVEX_SOURCE_REPO=/path/to/repo
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const sourceRepo = process.env.CONVEX_SOURCE_REPO
  ? resolve(process.env.CONVEX_SOURCE_REPO)
  : resolve(repoRoot, "..", "threescoredb");

const sourceDir = join(sourceRepo, "convex");
const targetDir = join(repoRoot, "convex");
const checkOnly = process.argv.includes("--check");

const MARKER = "GENERATED.md";
const BANNER = `# Generated — do not edit

This directory is a **read-only mirror** of \`convex/\` in the dashboard repo
(\`threescoredb\`), which is the single source of truth for the Convex schema and
functions, and the only repo that runs \`npx convex deploy\`.

Editing anything here will be overwritten by the next \`yarn convex:sync\`, and
changes made here are never deployed. Change the schema or a function in the
dashboard repo, run \`npx convex dev\` there to regenerate types, then run
\`yarn convex:sync\` here.
`;

function collect(dir, base = "") {
  const out = new Map();
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(abs).isDirectory()) {
      for (const [k, v] of collect(abs, rel)) out.set(k, v);
    } else if (rel !== MARKER) {
      out.set(rel, readFileSync(abs));
    }
  }
  return out;
}

if (!existsSync(sourceDir)) {
  console.error(
    `Convex source not found at ${sourceDir}\n` +
      `Clone the dashboard repo next to this one, or set CONVEX_SOURCE_REPO.`
  );
  process.exit(1);
}

const source = collect(sourceDir);
const target = collect(targetDir);

const drift = [];
for (const [rel, buf] of source) {
  const existing = target.get(rel);
  if (existing === undefined) drift.push(`+ ${rel}`);
  else if (!existing.equals(buf)) drift.push(`M ${rel}`);
}
for (const rel of target.keys()) {
  if (!source.has(rel)) drift.push(`- ${rel}`);
}

if (checkOnly) {
  if (drift.length === 0) {
    console.log(`convex mirror is in sync with ${sourceDir}`);
    process.exit(0);
  }
  console.error(
    `convex mirror has drifted from ${sourceDir}:\n` +
      drift.map((d) => `  ${d}`).join("\n") +
      `\n\nRun \`yarn convex:sync\`. Never edit convex/ in this repo directly.`
  );
  process.exit(1);
}

rmSync(targetDir, { recursive: true, force: true });
for (const [rel, buf] of source) {
  const dest = join(targetDir, rel);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, buf);
}
writeFileSync(join(targetDir, MARKER), BANNER);

console.log(
  `Synced ${source.size} file(s) from ${sourceDir}` +
    (drift.length ? `\n${drift.map((d) => `  ${d}`).join("\n")}` : " (no changes)")
);
