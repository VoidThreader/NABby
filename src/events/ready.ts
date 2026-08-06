import { Events, Client } from 'discord.js';
import { Event } from '../structures/types.js';

const event: Event<Events.ClientReady> = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client<true>): void {
        console.log("NABby is online");
        console.log(`Client: All eyes on ${client.user?.username}!`);
    },
}

export default event;