import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../structures/types.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong."),
    
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("Pong!");
    },
};

export default command;