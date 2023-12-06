const maria = require('mysql');
require('dotenv').config();

const conn = maria.createConnection({
    host : process.env.DB_HOST_NAME,
    port : 3306,
    user : process.env.DB_HOST_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
});

module.exports = conn;