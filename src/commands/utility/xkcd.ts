import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/types.js";
import { getRandInt } from "../../structures/rand.js";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('xkcd')
        .setDescription("Fetches a random xkcd."),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();
        try {
            const request = await fetch("https://xkcd.com/info.0.json");
            if (!request.ok) throw new Error(`HTTP error! status: ${request.status}`);
            const data = await request.json();
            
            try {
                const num = getRandInt(1, data.num);
                const xkcdRequest = await fetch(`https://xkcd.com/${num}/info.0.json`);
                if (!xkcdRequest.ok) throw new Error(`HTTP error! status: ${request.status}`);
                const xkcd = await xkcdRequest.json();
                const embed = new EmbedBuilder()
                    .setTitle(`${xkcd.safe_title}`)
                    .setAuthor({ name: 'XKCD', iconURL: interaction.client.user.displayAvatarURL() })
                    .setColor(0x4AA8FF)
                    .setDescription(`https://xkcd.com/${num}\n${xkcd.alt}`)
                    .setImage(`${xkcd.img}`);
                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                await interaction.editReply("Failed to fetch an xkcd comic.");
                console.error(error);
            }

        } catch(error) {
            await interaction.editReply("Currently having trouble fetching xkcd comics.");
            console.error(`Failed to fetch xkcd: ${error}`);
        }
    }
};

export default command;