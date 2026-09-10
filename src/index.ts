import "dotenv/config";
import { GatewayIntentBits } from "discord.js";
import { TsClient } from "./structures/tsClient.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs  from "node:fs";
import path from "node:path";

// boilerplate, used for checking file names and directory names
const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);
const ext = __filename.endsWith(".ts") ? ".ts" : ".js";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) {
    throw new Error("Missing required environment variable: DISCORD_TOKEN");
}

// Paths
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(ext));

const client = new TsClient({
    intents: [
        // Required
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,

        // Uncomment if needed
        //GatewayIntentBits.AutoModerationConfiguration,
        //GatewayIntentBits.AutoModerationExecution,
        //GatewayIntentBits.DirectMessagePolls,
        //GatewayIntentBits.DirectMessageReactions,
        //GatewayIntentBits.DirectMessageTyping,
        //GatewayIntentBits.DirectMessages,
        //GatewayIntentBits.GuildExpressions,        
        //GatewayIntentBits.GuildIntegrations,
        //GatewayIntentBits.GuildInvites,
        //GatewayIntentBits.GuildMembers,
        //GatewayIntentBits.GuildMessagePolls,
        //GatewayIntentBits.GuildMessageReactions,
        //GatewayIntentBits.GuildMessageTyping,
        //GatewayIntentBits.GuildModeration,
        //GatewayIntentBits.GuildPresences,
        //GatewayIntentBits.GuildScheduledEvents,
        //GatewayIntentBits.GuildVoiceStates,
        //GatewayIntentBits.GuildWebhooks,
    ]
});

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(ext));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = (await import(pathToFileURL(filePath).href)).default;
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = (await import(pathToFileURL(filePath).href)).default;
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

try {
    await client.login(DISCORD_TOKEN);
} catch (error) {
    console.error(`Failed to login:\n${error}`);
}