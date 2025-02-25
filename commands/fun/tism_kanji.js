const path = require('path');
const fs = require('node:fs/promises');
const { SlashCommandBuilder } = require('discord.js');

const dict = path.join(process.cwd(), 'tism_kanji_ime_dicts/大漢和検字番号.txt')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tism_kanji')
		.setDescription("get tism kanji")
		.addIntegerOption(option =>
			option.setName('number')
				.setDescription("number of tism kanji")),
	async execute(interaction) {
		const number = interaction.options.getInteger('number') ?? 1;
		if (number < 1) {
			await interaction.reply("please use a number greater than 0");
		}

		await interaction.deferReply();

		try {
			const data = await fs.readFile(dict, { encoding: 'utf8' });
			let lines = data.split('\n');

			let combined = ""
			for (let i = 0; i < number; i++) {
				let line = lines[Math.floor(Math.random()*lines.length)];
				let kanji = line.split('\t')[1]
				combined = combined + kanji
			}
			await interaction.editReply({ content: combined })
		} catch (err) {
			console.log('[ERROR] tism_kanji.js');
			console.log(err);
			await interaction.editReply({ content: 'fail' })
		}
	}
};
