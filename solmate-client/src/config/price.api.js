/* eslint-disable import/prefer-default-export */
import axios from 'axios';

const coingeckoClient = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3/',
    timeout: 30000,
});

const arweaveClient = axios.create({
    baseURL: 'https://arweave.net/',
    timeout: 30000,
});

export const getPrices = async () => {
    const { data } = await coingeckoClient.get('/simple/price', {
        params: {
            ids: 'solana,arweave',
            vs_currencies: 'usd',
        },
    });
    return data;
};

export const getArweaveFees = async () => {
    const arweaveTxnFee = (await arweaveClient.get('/price/0')).data;
    const oneByteCost = (await arweaveClient.get('/price/1')).data - arweaveTxnFee + 2;
    return { arweaveTxnFee, oneByteCost };
};
