const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jisho')
		.setDescription('search a japanese dictionary.')
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

		await interaction.deferReply({ ephemeral: ephemeral })
		try {
			const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${query}`);
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
				return;
			}
			
			const json = await response.json();

			const currentResult = json.data[0];

			const wordNReading = (currentResult.japanese
				.reduce((accumulator, currentValue) => accumulator + 
					(currentValue.word ? currentValue.word + ' (' : '') 
					+ currentValue.reading 
					+ (currentValue.word ? ')' : '') + ', ', ''))
				.slice(0, -2); //trim remaining ', '

			let formattedSenses = '';

			const senses = currentResult.senses;
			for (sense in senses) {
				const englishDefinitions = senses[sense].english_definitions.join(', ');
				const info = senses[sense].parts_of_speech.concat(senses[sense].info).join(', ');

				formattedSenses = formattedSenses +
					`${sense + 1}. ${englishDefinitions}${info.length >= 1 ? ' *[' + info +']*' : '' } \n`
			}

			formattedSenses = formattedSenses.slice(0, -2);

			const embed = new EmbedBuilder()
				.setTitle(`${query}`)
				.addFields(
					{ name: wordNReading, value: formattedSenses }
				)
				
			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			console.log('[ERROR] jisho.js');
			console.log(error);
			await interaction.editReply({ content: 'failed to fetch jisho api! sorry!!!' });
		}
	},
};
