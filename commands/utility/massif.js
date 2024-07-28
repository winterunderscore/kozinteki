const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('massif')
		.setDescription('search massif for example sentences.')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('what you want to search.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('ephemeral')
				.setDescription('if you want it to be ephemeral.')),
	async execute(interaction) {
		const query = interaction.options.getString('query');
		const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;
		let resultLimit = 5;

		await interaction.deferReply({ ephemeral: ephemeral })
		try {

			const response = await fetch(`https://massif.la/ja/search?q=${query}&fmt=json`);
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
				return;
			}
			
			const json = await response.json();
			resultLimit = resultLimit > json.results.length ? json.results.length : resultLimit

			if (!json.results.length) {
				await interaction.editReply('no results found');
				return;
			}

			const embed = new EmbedBuilder()
				.setTitle(`${query} (showing ${resultLimit} out of ${json.hits})`)

			for (let i = 0; i < resultLimit; i++) {
				const result = json.results[i]
				const highlighted = result.highlighted_html.replaceAll('<em>', '**__').replaceAll('</em>', '__**');
				const sourceNDate = '[' + result.sample_source.title + '](' + result.sample_source.url + ') ' + result.sample_source.publish_date
				embed.addFields({
					name: ' ',
					value: `${highlighted}\n-# ${sourceNDate}` 
						+ (result.source_count > 1 ? ' *(and ' + (result.source_count - 1) +  ' other'
						+ (result.source_count > 2 ? 's' : '')
						+ ')*' : '')
				});
			}
				
			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			console.log('[ERROR] massif.js');
			console.log(error);
			await interaction.editReply({ content: 'failed to fetch massif api! sorry!!!' });
		}
	},
};
