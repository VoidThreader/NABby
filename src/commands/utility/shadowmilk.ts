import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../structures/types.js';
import { getRandInt } from '../../structures/rand.js';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('shadowmilk')
		.setDescription('Sends an image of shadow milk cookie.'),
	async execute(interaction) {
		const files = [
			'./assets/smc_plush.png',
			'./assets/smc_sing.png',
			'./assets/smc_laugh.png',
			'./assets/smc_serious.png',
		];
		await interaction.reply({ files: [files[getRandInt(0, files.length - 1)]] });
	},
};

export default command;