import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const stamp = new Date().toISOString().slice(0, 10);
const destDir = join(root, "archives", stamp);
const zipName = `KG_DATA-${stamp}.zip`;
const zipPath = join(root, "archives", zipName);

if (existsSync(destDir)) rmSync(destDir, { recursive: true, force: true });
mkdirSync(destDir, { recursive: true });
cpSync(join(root, "data"), join(destDir, "data"), { recursive: true });

writeFileSync(
  join(destDir, "MANIFEST.json"),
  `${JSON.stringify(
    {
      name: "KG_DATA",
      archivedAt: new Date().toISOString(),
      includes: ["data/catalog.json", "data/collections/**", "data/schema/**"],
      note: "本归档只含知识数据，不含 node_modules / dist。",
    },
    null,
    2,
  )}\n`,
);

if (existsSync(zipPath)) rmSync(zipPath, { force: true });

execFileSync("tar", ["-a", "-c", "-f", zipPath, "-C", destDir, "."], { stdio: "inherit" });

process.stdout.write(`archived -> archives/${stamp}/\n`);
process.stdout.write(`zip      -> archives/${zipName}\n`);
