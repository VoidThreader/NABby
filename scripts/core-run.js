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

// Function that runs the python process which calls the ollama backend
function runScript(relativeScriptPath) {
    const scriptPath = path.join(cwd, relativeScriptPath);
    console.log(`\n> ${venvPython} ${scriptPath}`);
    return spawnSync(venvPython, [scriptPath], { stdio: "inherit", cwd });
}

let result = runScript(path.join("src", "core", "main.py"));

if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}

process.exit(result.status ?? 1);