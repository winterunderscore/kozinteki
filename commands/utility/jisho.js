const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jisho')
		.setDescription('search a japanese dictionary.')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('what you want to search.')
				.setRequired(true)),
	async execute(interaction) {
		const query = interaction.options.getString('query');

		await interaction.deferReply({ ephemeral: true })
		try {
			const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${query}`);
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
				return;
			}

			const json = await response.json();
			console.log(json);
			await interaction.editReply('not work yet');
		} catch (error) {
			console.log('[ERROR] jisho.js');
			console.log(error.message);
			await interaction.editReply({ content: 'failed to fetch jisho api! sorry!!!', ephemeral: true });
		}
	},
};
