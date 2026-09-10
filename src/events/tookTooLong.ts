import { Events } from 'discord.js';
import { Event } from '../structures/types.js';

const event: Event<Events.MessageCreate> = {
    name: Events.MessageCreate,
    async execute(message): Promise<void> {
        if (!message.inGuild() || message.author.bot) return;

        if (message.content.toLowerCase().includes("taking too long")) {
            try {
                await message.channel.send({ files: ['./assets/your_taking_too_long.png'] });
            } catch (error) {
                console.error("Took too long to message:", error);
            }
        }
    },
}

export default event;
