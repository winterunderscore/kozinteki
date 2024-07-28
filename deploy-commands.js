const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		console.log(`[INFO] deploying command ${folder}/${command.data.name} on path ${filePath}`);
		if ('data' in command && 'execute' in command) {
			const JSON = command.data.toJSON();
			const extras = {
				"integration_types": [0, 1],
				"contexts": [0, 1, 2],
			}
			Object.keys(extras).forEach(key => JSON[key] = extras[key]);
			commands.push(JSON);
		} else {
			console.log(`[WARNING]: command ${filePath} is missing a 'data' and an 'execute' property.`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`[INFO] refreshing ${commands.length} slash commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`[INFO] sucessfully reloaded ${data.length} slash commands.`);
	} catch (error) {
		console.log(error);
	}
})()
