import { Events } from 'discord.js';
import { Event } from '../structures/types.js';

const event: Event<Events.MessageCreate> = {
    name: Events.MessageCreate,
    async execute(message): Promise<void> {
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
    },
}

export default event;