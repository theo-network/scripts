const { Client } = require('pg');
require('dotenv').config()

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME
const DB_PORT = process.env.DB_PORT


const db = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

async function connectAndCreateSchema() {
    try {
        await db.connect();
        console.log('Successfully connected to database!');
        await createSchema();
        console.log('Successfully created schema!');
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
}

connectAndCreateSchema();
    

db.promise = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}


const createSchema = async () => {
    try {
        const aaveQuery = `
            CREATE TABLE IF NOT EXISTS "aave" (
                "eth_supply_rate" DOUBLE PRECISION NOT NULL,
                "btc_supply_rate" DOUBLE PRECISION NOT NULL,
                "usdc_borrow_rate" DOUBLE PRECISION NOT NULL,
                "block_number" INT NOT NULL,
                "timestamp" INT NOT NULL,
                "date" TIMESTAMPTZ NOT NULL,
                PRIMARY KEY ("timestamp")
            );
	    `
        await db.query(aaveQuery)
        console.log('Aave Table created successfully!')

        const dydxQuery = `
            CREATE TABLE IF NOT EXISTS "dydx" (
                "eth_funding_rate" DOUBLE PRECISION NOT NULL,
                "btc_funding_rate" DOUBLE PRECISION NOT NULL,
                "timestamp" INT NOT NULL,
                "date" TIMESTAMPTZ NOT NULL,
                PRIMARY KEY ("timestamp")
            );
	    `
        await db.query(dydxQuery)
        console.log('Dydx Table created successfully!')


        const hyperliquidQuery = `
            CREATE TABLE IF NOT EXISTS "hyperliquid" (
                "eth_funding_rate" DOUBLE PRECISION NOT NULL,
                "btc_funding_rate" DOUBLE PRECISION NOT NULL,
                "timestamp" INT NOT NULL,
                "date" TIMESTAMPTZ NOT NULL,
                PRIMARY KEY ("timestamp")
            );
	    `
        await db.query(hyperliquidQuery)
        console.log('Hyperliquid Table created successfully!')
    } catch (err) {
        console.error('Error creating schema', err);
    }
};

module.exports = { db };