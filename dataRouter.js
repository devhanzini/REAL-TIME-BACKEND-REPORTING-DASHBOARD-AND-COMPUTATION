const { response } = require("express");

const config = require("./dbconfig");
const sql = require("mssql/msnodesqlv8");
const fs = require('fs-extra')
    // const path = require('path');
const express = require('express');




const app = express();
const ejs = require('ejs');
// const sql = require('./sql'); // Assuming you have a module to handle SQL queries

app.set('view engine', 'ejs');
app.use(express.static('public')); // Assuming your static files are in a directory named 'public'





const util = require('util');

// SQL configuration
const config = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server',
    database: 'your_database',
    options: {
        encrypt: true   // If you're using Azure
    }
};

// Promisify fs.writeFile
const writeFile = util.promisify(fs.writeFile);

async function downloadData(data, filename) {
    try {
        // Convert data to CSV format
        const csv = convertToCSV(data);
        
        // Write CSV to file
        await writeFile(filename, csv, 'utf8');
        console.log(`Data has been written to ${filename}`);
    } catch (error) {
        console.log("Error while downloading data:", error);
    }
}

function convertToCSV(data) {
    let csv = '';
    if (data.length > 0) {
        // Extract column headers
        const headers = Object.keys(data[0]).join(',') + '\n';
        csv += headers;
        
        // Extract data rows
        data.forEach(row => {
            csv += Object.values(row).join(',') + '\n';
        });
    }
    return csv;
}

async function getagricloan_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[AGRICULTURAL.LOANS]");
        return res.recordsets;
    } catch (error) {
        console.log("mathus-error :" + error);
    }
}

async function getsmallbussloan_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[SMALL.BUSS.LOANS]");
        return res.recordsets;
    } catch (error) {
        console.log("mathus-error :" + error);
    }
}

router.get('/download', async (req, res) => {
    try {
        // Fetch data
        const agricLoanData = await getagricloan_withQuery();
        const smallBussLoanData = await getsmallbussloan_withQuery();
        
        // Download data
        await downloadData(agricLoanData, 'agricultural_loans.csv');
        await downloadData(smallBussLoanData, 'small_business_loans.csv');
        
        // Respond to the client
        res.send('Data downloaded successfully!');
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
