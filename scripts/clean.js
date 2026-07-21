import { rmSync } from "node:fs";
import console from "node:console";
import path from "node:path";
import process from "node:process";

const cwd = process.cwd();
const buildDir = path.join(cwd, "build");

rmSync(buildDir, { recursive: true, force: true });

console.log(`Cleaned ${buildDir}`);