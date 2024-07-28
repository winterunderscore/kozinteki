
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletetag')
		.setDescription('delete an existing tag.')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('name of the tag.')
				.setRequired(true)),
	async execute(interaction) {
		const tagName = interaction.options.getString('name');
		const rowCount = await interaction.client.Tags.destroy({ where: { name: tagName } });

		if (!rowCount) return interaction.reply({ content: 'tag doesnt exist.', ephemeral: true });
		return interaction.reply({ content: 'tag deleted.', ephemeral: true });
	},
};
