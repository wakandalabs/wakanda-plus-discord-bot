const { SlashCommandBuilder } = require('@discordjs/builders');
const { WAKANDAPASS_ADDRESS } = require("../constant/address");
const SupportedChainId = require("../constant/chains");
const { getExplorerLink, ExplorerDataType } = require("../utils/getExplorerLink");

module.exports = {
	data: new SlashCommandBuilder()
			.setName('portal')
			.setDescription('Portal of Wakanda+.'),
	async execute(interaction) {
		await interaction.reply({
			content: `Polygon portal: *${getExplorerLink(SupportedChainId.POLYGON, WAKANDAPASS_ADDRESS[SupportedChainId.POLYGON], ExplorerDataType.TOKEN)}*

Flow portal: *[wakanda+](https://wakandaplus.wakanda-labs.com)*`,
		})
	},
};
