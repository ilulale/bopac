const {SlashCommandBuilder} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fire_test')
		.setDescription('Replies to you'),
	async execute(interaction) {
		await interaction.reply('Who has dared to awaken me!');
	},
};
