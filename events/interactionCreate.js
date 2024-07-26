const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		console.log(`[INFO] [INTERACTION]: interaction created ${interaction.commandName} by ${interaction.user.username}`);

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`[ERROR] [INTERACTION] no command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`[ERROR] [INTERACTION] ${error}`);
			if (interaction.replied || interaction.deffered) {
				await interaction.followUp({ content: 'there was an error while executing this command! sorry!!!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'there was an error while executing this command! sorry!!!', ephemeral: true });
			}
		}
	},
};
