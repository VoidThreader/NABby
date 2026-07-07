import "dotenv/config";
import { 
    Client, ClientOptions, Collection, 
    Events, GatewayIntentBits, MessageFlags, 
} from "discord.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Command } from "./structures/types.js";
import fs  from "node:fs";
import path from "node:path";

// boilerplate, used for checking file names and directory names
const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) {
    throw new Error("Missing required environment variable: DISCORD_TOKEN");
}

// boilerplate
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// client.commands throws an error, this is the alternative/fix
class TsClient extends Client {
    commands: Collection<string, Command> = new Collection();
    constructor(options: ClientOptions) {
        super(options);
    }
}

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
    const ext = __filename.endsWith(".ts") ? ".ts" : ".js";
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

client.on(Events.ClientReady, () => {
    console.log("NABby is online");
    console.log(`Client: All eyes on ${client.user?.username}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = (interaction.client as TsClient).commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
});

client.on(Events.MessageCreate, async message => {
    if (!message.inGuild()) return;

    const logEntry = `[${new Date().toLocaleString()}] Message from ${message.author.username} in #${message.channel.name} (${message.channel.id}):\n${message.content}`;
    console.log(logEntry);

    if (message.author.bot) return;

    if (message.content.includes(":3")) {
        try {
            await message.channel.send(":3");
        } catch (error) {
            console.error("Failed to send :3 message:", error);
        }
    }
});

try {
    await client.login(DISCORD_TOKEN);
} catch (error) {
    console.error(`Failed to login:\n${error}`);
}