const { db } = require("./db");
const axios = require('axios');
const fetchAndStoreHyperliquidData = async (blockTimestamp) => {
    try {
        const response = await axios.post('https://api.hyperliquid.xyz/info', { type: "metaAndAssetCtxs" });
        const ethIndex = response.data[0].universe.findIndex((asset) => asset.name === "ETH");
        const btcIndex = response.data[0].universe.findIndex((asset) => asset.name === "BTC");
        const { funding: ethFundingRate } = response.data[1][ethIndex];
        const { funding: btcFundingRate } = response.data[1][btcIndex];
        await db.promise("INSERT INTO hyperliquid(eth_funding_rate, btc_funding_rate, timestamp, date) VALUES ($1,$2,$3,$4)", [Number(ethFundingRate).toFixed(10), Number(btcFundingRate).toFixed(10), blockTimestamp, new Date(blockTimestamp * 1000)]);
    } catch (err) {
        console.log(`[${new Date().toISOString()}] Error fetching and storing Hyperliquid data: `, err);
        throw "Error fetching and storing Hyperliquid data";
    }
};

module.exports = { fetchAndStoreHyperliquidData }