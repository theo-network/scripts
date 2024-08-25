const  ethers = require("ethers");
const BigNumber = require("bignumber.js")
const {db} = require("./db");
const AAVE_POOL_ADDRESS = "0x794a61358d6845594f94dc1db02a252b5b4814ad"
const WETH_ADDRESS = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
const WBTC_ADDRESS = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
const USDC_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
const AAVE_POOL_ABI = [{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveData","outputs":[{"components":[{"components":[{"internalType":"uint256","name":"data","type":"uint256"}],"internalType":"struct DataTypes.ReserveConfigurationMap","name":"configuration","type":"tuple"},{"internalType":"uint128","name":"liquidityIndex","type":"uint128"},{"internalType":"uint128","name":"currentLiquidityRate","type":"uint128"},{"internalType":"uint128","name":"variableBorrowIndex","type":"uint128"},{"internalType":"uint128","name":"currentVariableBorrowRate","type":"uint128"},{"internalType":"uint128","name":"currentStableBorrowRate","type":"uint128"},{"internalType":"uint40","name":"lastUpdateTimestamp","type":"uint40"},{"internalType":"uint16","name":"id","type":"uint16"},{"internalType":"address","name":"aTokenAddress","type":"address"},{"internalType":"address","name":"stableDebtTokenAddress","type":"address"},{"internalType":"address","name":"variableDebtTokenAddress","type":"address"},{"internalType":"address","name":"interestRateStrategyAddress","type":"address"},{"internalType":"uint128","name":"accruedToTreasury","type":"uint128"},{"internalType":"uint128","name":"unbacked","type":"uint128"},{"internalType":"uint128","name":"isolationModeTotalDebt","type":"uint128"}],"internalType":"struct DataTypes.ReserveDataLegacy","name":"","type":"tuple"}],"stateMutability":"view","type":"function"}]

const fetchAndStoreAaveData = async (blockNumber, blockTimestamp, provider) => {
    try{
        const aavePoolContract = new ethers.Contract(AAVE_POOL_ADDRESS, AAVE_POOL_ABI, provider);
        const {currentLiquidityRate: ethSupplyRate} = await aavePoolContract.getReserveData(WETH_ADDRESS, {blockTag : blockNumber});
        const {currentLiquidityRate: btcSupplyRate} = await aavePoolContract.getReserveData(WBTC_ADDRESS, {blockTag : blockNumber});
        const {currentVariableBorrowRate: usdcBorrowRate} = await aavePoolContract.getReserveData(USDC_ADDRESS, {blockTag : blockNumber});
        const ethSupplyRateFormatted = BigNumber(ethSupplyRate).dividedBy(BigNumber(10n ** 27n)).toFixed(10);
        const btcSupplyRateFormatted = BigNumber(btcSupplyRate).dividedBy(BigNumber(10n ** 27n)).toFixed(10);
        const usdcBorrowRateFormatted =  BigNumber(usdcBorrowRate).dividedBy(BigNumber(10n ** 27n)).toFixed(10);
        await db.promise("INSERT INTO aave(eth_supply_rate, btc_supply_rate, usdc_borrow_rate, block_number, timestamp, date) VALUES ($1,$2,$3,$4,$5,$6)",[ethSupplyRateFormatted, btcSupplyRateFormatted, usdcBorrowRateFormatted, blockNumber, blockTimestamp, new Date(blockTimestamp * 1000)]);
    }
    catch (err) {
        console.log(`[${new Date().toISOString()}] Error fetching and storing Aave data: `, err);
        throw "Error fetching and storing Aave data";
    }
};

module.exports = {fetchAndStoreAaveData}