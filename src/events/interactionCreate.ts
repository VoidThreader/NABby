import { Events, MessageFlags } from 'discord.js';
import { Event } from '../structures/types.js';
import { TsClient } from '../structures/tsClient.js';

const event: Event<Events.InteractionCreate> = {
    name: Events.InteractionCreate,
    async execute(interaction): Promise<void> {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.guild || !interaction.channel) {
            await interaction.reply({ content: "This command can only be used inside a server.", flags: MessageFlags.Ephemeral });
            return;
        }
        if (!interaction.channel?.isSendable()) {
            await interaction.reply({ content: "This command can only be used in a text channel.", flags: MessageFlags.Ephemeral });
            return;
        }
        
        const command = (interaction.client as TsClient).commands.get(interaction.commandName);
    
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        const { commandName, user, channel } = interaction;
        const channelName = 'name' in channel ? `#${channel.name}` : `#${channel.id}`;
        console.log(`[COMMAND] /${commandName} used by ${user.displayName} (${user.id}) in #${channelName}`);
    
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
}

export default event;
