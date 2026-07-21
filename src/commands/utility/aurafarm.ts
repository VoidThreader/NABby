import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../structures/types.js';
import { getRandInt } from '../../structures/rand.js';
import path from 'node:path';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('aurafarm')
		.setDescription('Silent Salt aurafarming.'),

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.deferReply();

		const files = [
			path.resolve('assets/ssc_aurafarm.gif'),
			path.resolve('assets/ssc_aurafarm1.gif'),
			path.resolve('assets/ssc_aurafarm2.gif'),
		]
		try {
			const file = files[getRandInt(0, files.length - 1)];
			await interaction.editReply({
				files: [file]
			})
		} catch (err) {
			console.error('Aurafarmed too hard!\n', err);
			await interaction.editReply('Aurafarmed too hard!').catch(()=>{});
		}
	},
};

export default command;