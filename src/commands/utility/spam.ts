import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { Command } from '../../structures/types.js';
import fs from 'node:fs';
import path from 'node:path';
import Hjson from 'hjson';

const dataPath = path.join(process.cwd(), "data");
const dataFile = path.join(dataPath, "configs.hjson");

const configFile = fs.readFileSync(dataFile, 'utf-8');
const ALLOWED_USERS = Hjson.parse(configFile).allowed_users;

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('spam')
		.setDescription('Spam command.')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Set message to be spammed.')
				.setRequired(true),
		)

		.addIntegerOption(option =>
			option.setName('repeats')
				.setDescription('Repeat for:')
				.setRequired(false),
		),

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		if (!ALLOWED_USERS.includes(interaction.user.id)) {
			interaction.reply("You don't have permission to use this command.");
			return;
		}

		if (!interaction.channel || !('send' in interaction.channel)) {
			await interaction.reply({ content: "This command can only be used in a text channel.", flags: MessageFlags.Ephemeral });
			return;
		}

		await interaction.deferReply({ flags : MessageFlags.Ephemeral });

		const user = interaction.options.getString('message');
		const repetition = interaction.options.getInteger('repeats') ?? 1;

		if (!user) return;

		for (let i = 0; i < repetition; i++) {
			try {
				await interaction?.channel?.send(user);
			} catch (err) {
				console.error(`Spam failed: ${err}`)
			}
		}

		await interaction.editReply("Spamming complete.");
	},
};

export default command;