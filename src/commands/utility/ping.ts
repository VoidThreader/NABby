import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../structures/types.js";
import { performance } from "node:perf_hooks";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),
    
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const startTime = performance.now();

        const sent = await interaction.reply({ content: "```ansi\n\u001b[1mPinging...```", withResponse: true});
        const replyMessage = sent.resource?.message;
        if (replyMessage) {
            const roundTripLatency = replyMessage.createdTimestamp - interaction.createdTimestamp;
            const wsPing = interaction.client.ws.ping;
            const internalExec = Math.round(performance.now() - startTime);

            let latencyCol = 32; // default GREEN
            if (
                roundTripLatency > 1000 ||
                internalExec > 1000
            ) {
                latencyCol = 31; // RED if latency or exec value exceeds a second
            } else if (
                roundTripLatency > 500 ||
                internalExec > 500
            ) {
                latencyCol = 33; // YELLOW if latency or exec value is half a second or more
            }

            const displayWSPing = wsPing === -1 ? "Calculating..." : `${wsPing}ms`;

            await interaction.editReply(
                "```ansi\n" +
                `\u001b[1;${latencyCol}m(*) Pong!\n` +
                `\u001b[1;36mNetwork Latency: \u001b[0m${roundTripLatency}ms\n` +
                `\u001b[1;36mInternal Process: \u001b[0m${internalExec}ms\n` +
                `\u001b[1;36mWebSocket Ping: \u001b[0m${displayWSPing}` +
                "```"
            );
        } else {
            const failMessage = "Failed to calculate latency";
            
            await interaction.reply(
                "```ansi\n" +
                `\u001b[1;31m${failMessage}\u001b[0m` +
                "```"
            );
            console.error(failMessage);
        }
    },
};

export default command;