import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types.js';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides information about the bot\'s commands.'),

	async execute(interaction) {
		const helpMessage = new EmbedBuilder()
			.setTitle('NABby Commands')
			.setAuthor({ name: 'Bot Help', iconURL: interaction.client.user.displayAvatarURL() })
			.setColor(0x4AA8FF)
			.setDescription(`List of commands:\n
				• **/help**: Provides information about the bot's commands.
				• **/ping**: Checks the bot's latency.
				• **/flip**: Mystic flour cookie performs mystic flips.
				• **/aurafarm**: Silent Salt aurafarming.
				• **/rng**: Number guessing game, rolls a d20 on default. To quit, type "quit" in chat.
				• **/roll**: Rolls a d20 on default. Change it with given options.
				• **/8-ball**: Answers a question.
				• **/shadowmilk**: Sends an image of shadow milk cookie.
			`);

		await interaction.reply({ embeds: [helpMessage] });
	},
};

export default command;