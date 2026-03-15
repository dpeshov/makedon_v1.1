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

const dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(dirname, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

const gitSha =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.BUILD_SHA ||
  safeExec("git rev-parse --short HEAD") ||
  "unknown";

const gitDate =
  process.env.VERCEL_GIT_COMMIT_DATE ||
  process.env.BUILD_DATE ||
  safeExec("git log -1 --format=%cI") ||
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
