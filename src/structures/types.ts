import { 
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    ClientEvents,
} from "discord.js";

// Command interface for all commands
export interface Command {
    data: 
        | SlashCommandBuilder 
        | SlashCommandOptionsOnlyBuilder
        | SlashCommandSubcommandsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

// Event interface
export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (...args: ClientEvents[K]) => void | Promise<void>;
}

// Type Response handling
type TextResponse = { type: 'text'; content: string };
type ImageResponse = { type: 'image'; file: string };

export type ResponseItem = TextResponse | ImageResponse;