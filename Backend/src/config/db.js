const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 4000,
    ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true
    }
});

db.connect((err)=> {
    if(err){
        console.log("Database connection failed:", err);
    } else{
        console.log("Connected to TiDB Cloud!");
    }
})

module.exports = db;