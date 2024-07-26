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
		const embed = {
			image: {
				url: user.displayAvatarURL({ extension: ImageFormat.PNG, size: 2048 }),
			},
			title: `avatar of ${user.username}:`,
		}
		return interaction.reply({ embeds: [embed] });
	},
};
