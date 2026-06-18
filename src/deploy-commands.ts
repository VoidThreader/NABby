import "dotenv/config";
import { REST, Routes } from 'discord.js';
import { fileURLToPath, pathToFileURL } from "node:url";
import fs  from "node:fs";
import path from "node:path";

const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
    throw new Error("Missing required environment variables: DISCORD_TOKEN, CLIENT_ID, GUILD_ID");
}

const commands: object[] = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const ext = __filename.endsWith(".ts") ? ".ts" : ".js";
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(ext));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = (await import(pathToFileURL(filePath).href)).default;
        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST().setToken(DISCORD_TOKEN);

try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands },
    ) as object[];
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
    console.error(error);
}