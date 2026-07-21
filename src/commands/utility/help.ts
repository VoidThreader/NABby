import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/types.js';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides information about the bot\'s commands.'),

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const commands = interaction.client.commands;
		
        const helpMessage = new EmbedBuilder()
			.setTitle('NABby Commands')
			.setAuthor({ name: 'Bot Help', iconURL: interaction.client.user.displayAvatarURL() })
			.setColor(0x4AA8FF)
			.setDescription(`List of commands:\n`)
            .addFields(
                Array.from(commands.values())
                    .sort((a, b) => a.data.name.localeCompare(b.data.name))
                    .map((cmd) => ({
                        name: `/${cmd.data.name}`,
                        value: cmd.data.description,
                    }))
            );

		await interaction.reply({ embeds: [helpMessage] });
	},
};

export default command;