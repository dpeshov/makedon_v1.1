import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function safeExec(command) {
  try {
    return execSync(command, {
      stdio: ["ignore", "pipe", "ignore"]
    })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

function resolveGitDir(repoRoot) {
  const dotGitPath = path.join(repoRoot, ".git");
  try {
    const stat = fs.statSync(dotGitPath);
    if (stat.isDirectory()) return dotGitPath;

    const content = fs.readFileSync(dotGitPath, "utf8").trim();
    const match = content.match(/^gitdir:\s*(.+)\s*$/i);
    if (!match) return null;
    return path.resolve(repoRoot, match[1]);
  } catch {
    return null;
  }
}

function readGitInfoFromLogs(repoRoot) {
  const gitDir = resolveGitDir(repoRoot);
  if (!gitDir) return null;

  const logPath = path.join(gitDir, "logs", "HEAD");
  try {
    const content = fs.readFileSync(logPath, "utf8").trim();
    if (!content) return null;

    const lastLine = content.split(/\r?\n/).filter(Boolean).at(-1);
    if (!lastLine) return null;

    const match = lastLine.match(
      /^([0-9a-f]{40}) ([0-9a-f]{40}) (.+) (\d+) ([+-]\d{4})\t/
    );
    if (!match) return null;

    const sha = match[2].slice(0, 7);
    const timestampSeconds = Number(match[4]);
    if (!Number.isFinite(timestampSeconds)) return { sha };

    const date = new Date(timestampSeconds * 1000).toISOString();
    return { sha, date };
  } catch {
    return null;
  }
}

const dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(dirname, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

const logGitInfo = readGitInfoFromLogs(dirname);

const gitSha =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.BUILD_SHA ||
  safeExec("git rev-parse --short HEAD") ||
  logGitInfo?.sha ||
  "unknown";

const gitDate =
  process.env.VERCEL_GIT_COMMIT_DATE ||
  process.env.BUILD_DATE ||
  safeExec("git log -1 --format=%cI") ||
  logGitInfo?.date ||
  new Date().toISOString();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_BUILD_SHA: gitSha,
    NEXT_PUBLIC_BUILD_DATE: gitDate
  }
};

export default nextConfig;
