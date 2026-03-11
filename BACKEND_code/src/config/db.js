// const mysql = require('mysql2');
// const dotenv = require('dotenv');

// dotenv.config();

// const db = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT || 3306,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// }).promise();

// module.exports = db;

// const mysql = require('mysql2');
// const fs = require('fs');
// const path = require('path');
// const dotenv = require('dotenv');

// dotenv.config();

// const db = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
//     ssl: {
//         ca: fs.readFileSync(path.join(__dirname, 'ca.pem')), // Path to downloaded cert
//         rejectUnauthorized: true
//     },
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// }).promise();

// module.exports = db;

const mysql = require('mysql2'); // THIS MUST BE HERE
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, 'ca.pem')), // Path to cert
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

module.exports = db;