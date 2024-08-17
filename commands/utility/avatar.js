const { SlashCommandBuilder, APIEmbed, ImageFormat } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('get a users avatar.')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('whose avatar you want to get.')
				.setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const avatarUrl = user.displayAvatarURL({ extension: ImageFormat.PNG, size: 2048 })
		const embed = {
			color: user.accentColor,
			image: {
				url: avatarUrl,
			},
			title: `avatar of ${user.username}:`,
			url: avatarUrl
		}
		return interaction.reply({ embeds: [embed] });
	},
};
