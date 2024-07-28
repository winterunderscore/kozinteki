const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addtag')
		.setDescription('create a new tag.')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('name of the tag.')
				.setRequired(true))
		.addStringOption(option => 
			option.setName('description')
				.setDescription('description or contents of the tag.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('is_raw')
				.setDescription('whether it is sent raw or as an embed')),
	async execute(interaction) {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description');
		const isRaw = interaction.options.getBoolean('is_raw') ?? false;

		try {
			const tag = await interaction.client.Tags.create({
				name: tagName,
				description: tagDescription,
				username: interaction.user.username,
				raw: isRaw
			});

			return interaction.reply({ content: `tag ${tag.name} added.`, ephemeral: true});
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('tag already exists.');
			}
			console.log('[ERROR] addtag.js');
			console.log(error);
			return interaction.reply({ content: 'something went wrong.', ephemeral: true});
		}
	},
};
