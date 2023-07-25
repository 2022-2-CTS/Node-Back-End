const maria = require('mysql');

const conn = maria.createConnection({
    host : 'busanculture.cetauvrhxmoa.us-east-1.rds.amazonaws.com',
    port : 3306,
    user : 'root',
    password : 'mimi1221',
    database : 'busanCulture',
});

module.exports = conn;