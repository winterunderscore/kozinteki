const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('make the bot say anything.')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('the message you want the bot to say.')
				.setRequired(true)),
	async execute(interaction) {
		const message = interaction.options.getString('message', true);
		return interaction.reply(message);
	},
};
