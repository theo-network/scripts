const { db } = require("./db");
const axios = require('axios');
const fetchAndStoreDydxData = async (blockTimestamp) => {
    try {
        const ethResponse = await axios.get("https://indexer.dydx.trade/v4/perpetualMarkets?ticker=ETH-USD");
        const btcResponse = await axios.get("https://indexer.dydx.trade/v4/perpetualMarkets?ticker=BTC-USD");
        const ethFundingRate = ethResponse.data.markets["ETH-USD"].nextFundingRate;
        const btcFundingRate = btcResponse.data.markets["BTC-USD"].nextFundingRate;
        await db.promise("INSERT INTO dydx(eth_funding_rate, btc_funding_rate, timestamp, date) VALUES ($1,$2,$3,$4)", [Number(ethFundingRate).toFixed(10), Number(btcFundingRate).toFixed(10), blockTimestamp, new Date(blockTimestamp * 1000)]);
    }
    catch (err) {
        console.error('Error fetching and storing Dydx data:', err);
        throw err;
    }
};

module.exports = { fetchAndStoreDydxData }