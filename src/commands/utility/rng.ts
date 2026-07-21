import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { Command } from '../../structures/types.js';
import { getRandInt } from '../../structures/rand.js';

const activeGames = new Set<string>();

// Fuck my life
const command: Command = {
	data: new SlashCommandBuilder()
		.setName('rng')
		.setDescription(
			'Number guessing game, rolls a d20 on default. To quit, type "quit" in chat.',
		)
		.addIntegerOption(option =>
			option.setName('lowest')
				.setDescription('Lowest number to guess.')
				.setRequired(false),
		)
		.addIntegerOption(option =>
			option.setName('highest')
				.setDescription('Highest number to guess.')
				.setRequired(false),
		),

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const channelId = interaction.channelId;

		if (!interaction.channel || !('createMessageCollector' in interaction.channel)) {
			await interaction.reply({ content: "This command can only be used in a text channel.", flags: MessageFlags.Ephemeral });
			return;
		}

		if (activeGames.has(channelId)) {
			await interaction.reply({ content: 'Ah! Ah! Ah! A game is already in progress in this channel!', flags: MessageFlags.Ephemeral });
			return;
		}

		let lowest = interaction.options.getInteger('lowest') ?? 1;
		let highest = interaction.options.getInteger('highest') ?? 20;
		
		if (lowest > highest) {
			[lowest, highest] = [highest, lowest];
		}

		activeGames.add(channelId);

		const generatedNum = getRandInt(lowest, highest);
		await interaction.reply(`"I rolled a die! Guess which number I got from ${lowest} to ${highest}!"`);

		const collector = interaction?.channel?.createMessageCollector({
			filter: m => m.author.id === interaction.user.id,
			idle: 45000,
			time: 120000,
		});

		collector.on('collect', async (msg) => {
			const content = msg.content.trim().toLowerCase();
			
			if (content === 'quit') {
				msg.reply('Game\'s over!');
				collector.stop();
				return;
			}

			if (!/\d+/.test(content)) {
				return;
			}

			const guessedNum = parseInt(content, 10);

			if (guessedNum < lowest || guessedNum > highest) {
				msg.reply(`WHOAAA Pal! You're going out of range! Pick between ${lowest} and ${highest}.`);
				return;
			} else if (guessedNum < generatedNum) {
				msg.reply('WRONG! HIGHER!');
			} else if (guessedNum > generatedNum) {
				msg.reply('WRONG! LOWER!');
			} else if (guessedNum === generatedNum) {
				msg.reply('CORRECT! DING DING DING! We have a winner here!');
				collector.stop('won');
			}
		});

		collector.on('end', (_collected, reason) => {
			activeGames.delete(channelId);
			if (reason === 'idle' || reason === 'time') {
				interaction.followUp({ content: `Game timed out! The correct number was **${generatedNum}**.` }).catch(() => {});
			}
		});
	},
};

export default command;