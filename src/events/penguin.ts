import { Events } from 'discord.js';
import { Event } from '../structures/types.js';

const event: Event<Events.MessageCreate> = {
    name: Events.MessageCreate,
    async execute(message): Promise<void> {
        if (!message.inGuild() || message.author.bot) return;

        if (message.content.toLowerCase().includes('slashkig') 
            || message.content.toLowerCase().includes('penguin')) {
            try {
                await message.channel.send({
                    content: 'Slashkig is a Penguin!',
                    files: ['./assets/smc_sing.png'],
                });
            } catch (error) {
                console.error("Failed to call Slash a penguin:", error);
            }
	    }
    },
}

export default event;
