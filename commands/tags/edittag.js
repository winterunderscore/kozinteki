const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('edittag')
		.setDescription('edit an existing tag.')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('name of the tag.')
				.setRequired(true))
		.addStringOption(option => 
			option.setName('description')
				.setDescription('description or contents of the tag.')
				.setRequired(true)),
	async execute(interaction) {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description');
		const isRaw = interaction.options.getBoolean('is_raw') ?? false;
		
		const affectedRows = await interaction.client.Tags.update({ description: tagDescription }, { where: { name: tagName } });

		if (affectedRows > 0) {
			return interaction.reply({ content: `tag ${tagName} was edited.`, ephemeral: true });
		}

		return interaction.reply({ content: `could not find tag ${tagName}`, ephemeral: true });
	},
};
