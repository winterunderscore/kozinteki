const { SlashCommandBuilder, EmbedBuilder, ImageFormat } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tag')
		.setDescription('send the tag.')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('name of the tag.')
				.setRequired(true)),
	async execute(interaction) {
		const tagName = interaction.options.getString('name');

		const tag = await interaction.client.Tags.findOne({ where: { name: tagName } });

		if (!tag) return interaction.reply({ content: `didnt find tag ${tagName}`, ephemeral: true });
		tag.increment('usage_count');

		if (tag.get('raw')) return interaction.reply(tag.get('description'));

		const embed = new EmbedBuilder()
			.setTitle(`tag \'${tag.get('name')}\'`)
			.setDescription(tag.get('description'))
			.setThumbnail(interaction.user.displayAvatarURL({ extension: ImageFormat.PNG, size: 1024 }));
		
		return interaction.reply({ embeds: [embed] });
	},
};
