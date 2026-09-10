import { Events } from 'discord.js';
import { Event } from '../structures/types.js';

const event: Event<Events.MessageCreate> = {
    name: Events.MessageCreate,
    async execute(message): Promise<void> {
        if (!message.inGuild() || message.author.bot) return;

        if (message.content.includes(":3")) {
            try {
                await message.channel.send({ files: ['./assets/white_lily.png'] });
            } catch (error) {
                console.error("Failed to send :3 message:", error);
            }
        }
    },
}

export default event;
