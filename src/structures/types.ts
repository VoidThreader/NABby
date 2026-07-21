import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

// Command interface for all commands
export interface Command {
    data: 
        | SlashCommandBuilder 
        | SlashCommandOptionsOnlyBuilder
        | SlashCommandSubcommandsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}