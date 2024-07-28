const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verse')
		.setDescription('grabs a random bible verse'),
	async execute(interaction) {
		await interaction.deferReply();
		
		try {
			const response = await fetch('https://bible-api.com/?random=verse&translation=kjv');
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
				return;
			}

			const json = await response.json();

			await interaction.editReply(`${json.text}-# ${json.reference}`);
		} catch (error) {
			console.log('[ERROR] verse.js');
			console.log(error);
			await interaction.editReply({ content: 'failed to get random bible verse! sorry!!!' });
		}

	},
};
