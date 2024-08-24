const ethers = require("ethers");
const cron = require('node-cron');
require('dotenv').config()
const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL
const { fetchAndStoreAaveData } = require("./aave")
const { fetchAndStoreDydxData } = require("./dydx")
const { fetchAndStoreHyperliquidData } = require("./hyperliquid")
const provider = new ethers.JsonRpcProvider(ARBITRUM_RPC_URL);

cron.schedule('* * * * *', async () => {
    try {
        console.log("Fetching data...");
        const block = await provider.getBlock("latest");
        await Promise.all([
            fetchAndStoreAaveData(block.number, block.timestamp, provider),
            fetchAndStoreHyperliquidData(block.timestamp),
            fetchAndStoreDydxData(block.timestamp)
        ]);
        console.log("Finished fetching data...");
    } catch (error) {
        console.log(`Error running cron job at : ${Math.floor(Date.now() / 1000)}`, error);
    }
});