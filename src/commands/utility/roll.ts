import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../structures/types.js';
import { getRandInt } from '../../structures/rand.js';

// Fuck my life
const command: Command = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription(
			'Rolls a d20 on default. Change it with given options.',
		)
		.addIntegerOption(option =>
			option.setName('lowest')
				.setDescription('Lowest number to roll.')
				.setRequired(false),
		)
		.addIntegerOption(option =>
			option.setName('highest')
				.setDescription('Highest number to roll.')
				.setRequired(false),
		)
		.addIntegerOption(option =>
			option.setName('rolls')
				.setDescription('Number of dice rolls. Max of 100.')
				.setRequired(false),
		)
		.addIntegerOption(option =>
			option.setName('modifier')
				.setDescription('Add or subtract to your roll.')
				.setRequired(false),
		),

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {

		let sumRoll = 0;
		let finalRoll = 1;

		let lowest = interaction.options.getInteger('lowest') ?? 1;
		let highest = interaction.options.getInteger('highest') ?? 20;
		
		if (lowest > highest) {
			[lowest, highest] = [highest, lowest];
		}

		const rolls = Math.min(Math.max(interaction.options.getInteger('rolls') ?? 1, 1), 100);
		for (let i = 0; i < rolls; i++) {
			const generatedNum = getRandInt(lowest, highest);
			sumRoll += generatedNum;
		}

		const modifier = interaction.options.getInteger('modifier') ?? 0;

		if ((sumRoll + modifier) > 1) {
			finalRoll = sumRoll + modifier;
		}

		await interaction.reply(`${finalRoll}`);
	},
};

export default command;