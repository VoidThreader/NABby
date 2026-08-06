import { Client, ClientOptions, Collection } from 'discord.js';
import { Command } from './types.js';

export class TsClient extends Client {
    commands: Collection<string, Command> = new Collection();
    constructor(options: ClientOptions) {
        super(options);
    }
}