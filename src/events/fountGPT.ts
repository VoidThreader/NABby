import { Events } from 'discord.js';
import { Event } from '../structures/types.js';
import { getRandInt } from '../structures/rand.js';
import { ResponseItem } from '../structures/types.js';

const event: Event<Events.MessageCreate> = {
    name: Events.MessageCreate,
    async execute(message): Promise<void> {
        if (!message.inGuild() || message.author.bot) return;

        if (message.content.toLowerCase() == 'fountgpt is this true?') {
            try {
                const responses: ResponseItem[] = [
                    { type: 'text', content: 'Correct!' },
                    { type: 'text', content: 'It is decidedly so.' },
                    { type: 'text', content: 'Probably.' },
                    { type: 'text', content: 'No doubt about it.' },
                    { type: 'text', content: 'No.' },
                    { type: 'image', file: './assets/smc_serious.png' },
                ];

                const randomResponse = responses[getRandInt(0, responses.length - 1)];
                if (randomResponse.type === 'image') {
                    await message.channel.send({ files: [randomResponse.file] });
                } else {
                    await message.channel.send(randomResponse.content);
                }
            } catch (error) {
                console.error("Failed to send :3 message:", error);
            }
        }
    },
}

export default event;
