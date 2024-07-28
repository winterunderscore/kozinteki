const { SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('screenshot')
		.setDescription('screenshot a webpage')
		.addStringOption(option =>
			option.setName('webpage')
				.setDescription('which webpage you want to screenshot')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('ephemeral')
				.setDescription('if you want it to be ephemeral.')),
	async execute(interaction) {
		const webpage = interaction.options.getString('webpage');
		const ephemeral = interaction.options.getBoolean('ephemeral')

		await interaction.deferReply({ ephemeral: ephemeral });

		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto(webpage);
		await page.setViewport({ width: 1800, height: 1024 });

		const screenshot = await page.screenshot();
		await browser.close();

		await interaction.editReply({ content: 'screenshot:', files: [screenshot] });
	},
};
