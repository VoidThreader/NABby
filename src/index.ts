import "dotenv/config";
import { 
    Client, ClientOptions, Collection, 
    Events, GatewayIntentBits, MessageFlags, 
    REST, Routes
} from "discord.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Command } from "./types.js";
import fs  from "node:fs";
import path from "node:path";

const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

const rest = new REST().setToken(`${process.env.DISCORD_TOKEN}`)
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
const commands: object[] = [];

// client.commands throws an error, this is the alternative/fix
class TsClient extends Client {
    commands: Collection<string, Command> = new Collection();
    constructor(options: ClientOptions) {
        super(options);
    }
}

const client = new TsClient({
    intents: [
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessagePolls,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildExpressions,        
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessagePolls,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
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
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = await rest.put(
        Routes.applicationGuildCommands(`${process.env.CLIENT_ID}`, `${process.env.GUILD_ID}`),
        { body: commands },
    ) as object[];
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
    console.log(error);
}

client.on(Events.ClientReady, () => {
    console.log("Neos is online");
    console.log(`Client: All eyes on ${client.user?.username} (${client.user?.tag})!`);
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
        console.log(error);
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

    const logEntry = `[${new Date().toLocaleString()}] Message from ${message.author.tag} in #${message.channel.name} (${message.channel.id}):\n${message.content}`;
    console.log(logEntry);
    
    if (message.author.bot) return;
});

try {
    client.login(`${process.env.DISCORD_TOKEN}`);
} catch (error) {
    console.log(`Failed to login:\n${error}`);
}