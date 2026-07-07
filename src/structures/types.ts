import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Command interface for all commands
export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}