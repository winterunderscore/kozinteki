const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.Tags.sync();
		console.log(`[INFO] client ready, logged in as ${client.user.tag}`);
	},
};
