import { spawnSync } from "child_process";
import console from "node:console";
import process from "node:process";
import path from "node:path";

const cwd = process.cwd();
const isWindows = process.platform === "win32";

// Checks if host machine runs windows or a unix system.
// If host the machine is windows, Scripts is the path, otherwise it's bin.
const venvPython = isWindows
    ? path.join(cwd, ".venv", "Scripts", "python.exe")
    : path.join(cwd, ".venv", "bin", "python");

function run(command, args) {
    console.log(`\n> ${command} ${args.join(" ")}`);
    const result = spawnSync(command, args, { stdio: "inherit", cwd });

    if (result.error) {
        console.error(`Failed to run "${command}": ${result.error.message}`);
        process.exit(1);
    }

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

// Sets up .venv directory
run("python", ["-m", "venv", ".venv"]);

// Installs dependencies in requirements.tx
run(venvPython, ["-m", "pip", "install", "-r", "requirements.txt"]);

console.log("\nVirtual environment ready and dependencies installed.");