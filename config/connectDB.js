const sql = require('mssql/msnodesqlv8');

const configRoot = {
    server: 'LAPTOP-PTTI6N5Q\\SERVER_CHINH',
    user: 'sa',
    password: '2004',
    database: 'ShopOnline',
    driver: 'msnodesqlv8',
    options: {
        trustServerCertificate: true,
    },
};

const connectRoot = async () => {
    try {
        const pool = await new sql.ConnectionPool(configRoot).connect();
        console.log('Successfully connected to Root SQL Server.');
        return pool;
    } catch (err) {
        console.error('Unable to connect to Root SQL Server:', err);
        throw err;
    }
};

module.exports = { connectRoot, sql };
