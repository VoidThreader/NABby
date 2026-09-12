import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/types.js';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription("About NABby"),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.channel?.isSendable()) {
            await interaction.reply({ content: "This command can only be used in a text channel.", flags: MessageFlags.Ephemeral });
            return;
        }

        const aboutEmbed = new EmbedBuilder()
            .setTitle('About NABby')
            .setAuthor({ name: 'About', iconURL: interaction.client.user.displayAvatarURL() })
            .setColor(0x4AA8FF)
            .setDescription(
                `Utility Discord Bot for the server Operation Aziris.\n` +
                `Built in Discord.js v14 using TypeScript :sparkling_heart:\n\n` +
                `**GitHub**\n`+
                `[Source](https://github.com/VoidThreader/NABby)\n` +
                `[License](https://github.com/VoidThreader/NABby/blob/main/LICENSE)`
            );

        await interaction.channel.send({ embeds: [aboutEmbed] });
        await interaction.reply({ content: 'Sent', flags: MessageFlags.Ephemeral });
        await interaction.deleteReply();
    }
}

export default command;