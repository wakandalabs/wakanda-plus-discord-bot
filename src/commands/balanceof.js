const { SlashCommandBuilder } = require('@discordjs/builders');
const { getIdByUserId, getUser } = require("../dynamodb/wakandaplus");
const { isAddress } = require("../utils/address");
const ethers = require("ethers");
const { WAKANDAPASS_ADDRESS } = require("../constant/address");
const SupportedChainId = require("../constant/chains");
const geohash_abi = require("../abis/geohash.json");
const { RinkebyProvider, MumbaiProvider, GoerliProvider } = require("../libs/web3");

module.exports = {
	data: new SlashCommandBuilder()
			.setName('balanceof')
			.setDescription('Get balance of a user')
			.addUserOption(option => option.setName('user').setDescription('Target user'))
	,
	async execute(interaction) {
		const user = interaction.options.getUser('user') ?? interaction.user;
		const id = await getIdByUserId(user.id);
		if (id) {
			const q = await getUser(id);
			const info = q.Item;
			try {
				const wallets = Array.from(info.wallets);
				const rinkebyPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.RINKEBY], geohash_abi, RinkebyProvider)
				const mumbaiPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.POLYGON_MUMBAI], geohash_abi, MumbaiProvider)
				const goerliPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.GOERLI], geohash_abi, GoerliProvider)
				let balanceOfRinkeby = 0, balanceOfMumbai = 0, balanceOfGoerli = 0;
				for (const addr of wallets.filter(address => isAddress(address))) {
					// query balance of address
					const [rinkebyBalance, mumbaiBalance, goerliBalance] = await Promise.all([
						rinkebyPassContract.balanceOf(addr),
						mumbaiPassContract.balanceOf(addr),
						goerliPassContract.balanceOf(addr),
					]);
					balanceOfRinkeby += rinkebyBalance.toNumber();
					balanceOfMumbai += mumbaiBalance.toNumber();
					balanceOfGoerli += goerliBalance.toNumber();
				}
				await interaction.reply({
					content: `You total have ${balanceOfRinkeby} rinkebyPASS, ${balanceOfMumbai} polygonPASS and ${balanceOfGoerli} goerliPASS.`,
				});
			} catch (e) {
				console.log(e)
				await interaction.reply({
					content: 'None address.',
				});
			}
			
		} else {
			await interaction.reply({
				content: 'None user info.',
				ephemeral: true,
			});
		}
	},
};
