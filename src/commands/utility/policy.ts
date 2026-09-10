import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/types.js';
import fs from 'node:fs';
import path from 'node:path';
import Hjson from 'hjson';

const dataPath = path.join(process.cwd(), "data");
const dataFile = path.join(dataPath, "privacy-policy.hjson");

const policyFile = fs.readFileSync(dataFile, 'utf-8');
const POLICY = Hjson.parse(policyFile);

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('policy')
        .setDescription("Privacy Policy"),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.channel || !('send' in interaction.channel)) {
            await interaction.reply({ content: "This command can only be used in a text channel.", flags: MessageFlags.Ephemeral });
            return;
        }

        const policyEmbed = new EmbedBuilder()
            .setTitle(POLICY.title || 'Privacy Policy')
            .setAuthor({ name: 'Bot Help', iconURL: interaction.client.user.displayAvatarURL() })
            .setColor(0x4AA8FF)
            .setDescription(POLICY.description || "No description provided.");

        await interaction.channel.send({ embeds: [policyEmbed] });
        await interaction.reply({ content: 'Sent', flags: MessageFlags.Ephemeral });
        await interaction.deleteReply();
    }
}

export default command;