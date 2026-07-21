import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../structures/types.js';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Mystic flour cookie performs mystic flips.'),
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.reply({ files: ['./assets/mfc_flip.gif'] });
	},
};

export default command;