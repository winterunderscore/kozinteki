const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listtags')
		.setDescription('list all tags.'),
	async execute(interaction) {
		const tagList = await interaction.client.Tags.findAll({ attributes: ['name'] });
		const tagString = tagList.map(t => t.name).join(', ') || 'no tags set.';

		return interaction.reply({ content: `list of tags: ${tagString}`, ephemeral: true });
	},
};
