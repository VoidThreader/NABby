import { Events } from 'discord.js';
import { Event } from '../structures/types.js';

const event: Event<Events.MessageCreate> = {
    name: Events.MessageCreate,
    async execute(message): Promise<void> {
        if (!message.inGuild() || message.author.bot) return;

        if (message.content.toLowerCase().includes("*sips*")) {
            try {
                await message.channel.send({ files: ['./assets/esc_sip.png'] });
            } catch (error) {
                console.error("Took too long to message:", error);
            }
        }
    },
}

export default event;
