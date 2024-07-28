const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tagtoggleraw')
		.setDescription('toggle a tag\'s raw property')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('name of the tag.')
				.setRequired(true)),
	async execute(interaction) {
		const tagName = interaction.options.getString('name');
		
		const tag = await interaction.client.Tags.findOne({ where: { name: tagName } });

		if (!tag) return interaction.reply({ content: `could not find tag ${tagName}`, ephemeral: true });

		const affectedRows = await interaction.client.Tags.update({ raw: !tag.get('raw') }, { where: { name: tagName } });

		return interaction.reply({ content: `tag.raw: ` + !tag.get('raw'), ephemeral: true });
	},
};
