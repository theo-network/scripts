const { db } = require("./db");
const axios = require('axios');
const fetchAndStoreDydxData = async (blockTimestamp) => {
    try {
        const time = new Date(blockTimestamp * 1000).toISOString();
        const ethResponse = await axios.get(`https://indexer.dydx.trade/v4/historicalFunding/ETH-USD?effectiveBeforeOrAt=${time}&limit=1`);
        const btcResponse = await axios.get(`https://indexer.dydx.trade/v4/historicalFunding/BTC-USD?effectiveBeforeOrAt=${time}&limit=1`);
        const ethFundingRate = ethResponse.data.historicalFunding[0].rate;
        const btcFundingRate = btcResponse.data.historicalFunding[0].rate;
        await db.promise("INSERT INTO dydx(eth_funding_rate, btc_funding_rate, timestamp, date) VALUES ($1,$2,$3,$4)", [Number(ethFundingRate).toFixed(10), Number(btcFundingRate).toFixed(10), blockTimestamp, new Date(blockTimestamp * 1000)]);
    }
    catch (err) {
        console.error('Error fetching and storing Dydx data:', err);
        throw err;
    }
};

module.exports = { fetchAndStoreDydxData }