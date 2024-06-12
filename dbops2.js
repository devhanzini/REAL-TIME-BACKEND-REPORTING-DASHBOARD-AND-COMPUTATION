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



// Newton's method for finding roots of a function
function newton(func, guess) {
    const EPSILON = 1e-10;
    const MAX_ITERATIONS = 1000;
    let x0 = guess;
    let x1;
    let f0, f1;
    let iterations = 0;
    do {
        f0 = func(x0);
        f1 = derivative(func, x0);
        if (f1 === 0) {
            throw new Error("Derivative is zero.");
        }
        x1 = x0 - f0 / f1;
        if (++iterations > MAX_ITERATIONS) {
            throw new Error("Maximum iterations reached.");
        }
        x0 = x1;
    } while (Math.abs(x1 - x0) > EPSILON);
    return x1;
}
 
// Derivative calculation for Newton's method
function derivative(func, x) {
    const h = 1e-5;
    return (func(x + h) - func(x)) / h;
}
 
// Define xirrCache to store calculated XIRR values for caching
const xirrCache = {};
 
// Define xnpvMemory to store calculated XNPV values for caching (if needed)
const xnpvMemory = {};
 
// Function to connect to SQL Server
async function connectToSqlServer(config) {
    try {
        await sql.connect(config);
        console.log("Connected to SQL Server");
    } catch (error) {
        console.error("Error connecting to SQL Server:", error);
        throw error;
    }
}
 
// Function to query data from the database
async function queryData(productId) {
    try {
        const result = await sql.query `
            SELECT DATE, CASH_FLOW_AMT
            FROM [dbo].[HRM.LOANS]
            WHERE PRODUCT_ID = ${productId}
            GROUP BY DATE, CASH_FLOW_AMT
            ORDER BY DATE
        `;
        // Convert JavaScript dates to Excel serial dates
        const rows = result.recordset.map(row => ({
            CASH_FLOW_AMT: parseFloat(row.CASH_FLOW_AMT), // Parse the cash flow amount to float
            DATE: jsDateToExcelSerialDate(new Date(row.DATE))
        }));
        // Print extracted dates and cash flows
        console.log("Extracted Dates and Cash Flows for Product ID", productId, ":");
        rows.forEach(row => {
            console.log("Date:", row.DATE, "Cash Flow:", row.CASH_FLOW_AMT);
        });
        return rows;
    } catch (error) {
        console.error("Error querying data:", error);
        throw error;
    }
}
 
// Function to convert JavaScript Date object to Excel serial date
function jsDateToExcelSerialDate(date) {
    const excelStartDate = new Date('1899-12-30');
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const daysSinceStart = Math.floor((date - excelStartDate) / millisecondsInDay);
    const fractionOfDay = date.getHours() / 24 + date.getMinutes() / (24 * 60) + date.getSeconds() / (24 * 60 * 60);
    const excelSerialDate = daysSinceStart + fractionOfDay;
    return excelSerialDate;
}
 
// Function to calculate internal rate of return (IRR) as initial guess for XIRR
function calculateIRR(values, dates) {
    const cashflowsSum = values.reduce((sum, val) => sum + val, 0);
    const datesSum = dates.reduce((sum, val) => sum + val, 0);
    const averageCashflow = cashflowsSum / values.length;
    const averageDate = datesSum / dates.length;
    return averageCashflow / averageDate;
}
 
// XNPV calculation
function xnpv(rate, values, dates) {
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i] / Math.pow(1 + rate, (dates[i] - dates[0]) / 365);
    }
    return sum;
}
 
// XIRR calculation function with caching logic
function xirr(rows, productId) {
    try {
        // Check if XIRR value for this product ID and dates already exists in the cache
        const cacheKey = productId + JSON.stringify(rows.map(row => row.DATE));
        if (xirrCache[cacheKey] !== undefined) {
            console.log("XIRR value found in cache:", xirrCache[cacheKey]);
            return xirrCache[cacheKey];
        }
 
        // Extract cash flows and dates from rows
        const cashFlows = rows.map(row => row.CASH_FLOW_AMT);
        const dates = rows.map(row => row.DATE); // Assuming the DATE field is already in Excel serial date format
 
        // Calculate XIRR using the cash flows and dates
        const initialGuess = calculateIRR(cashFlows, dates);
        console.log("Initial guess for XIRR of Product ID", productId, ":", initialGuess);
        const xirrValue = newton(rate => xnpv(rate, cashFlows, dates), initialGuess);
        console.log("Calculated XIRR for Product ID", productId, ":", xirrValue);
 

        
            // Insert XIRR value into the databaseawait 
        insertXIRRIntoDatabase(productId, xirrValue);

        // Store the calculated XIRR value in the cache
        xirrCache[cacheKey] = xirrValue;
 

        // Write XIRR value to a file for caching
        fs.appendFileSync('xirr_cache.txt', `${productId},${xirrValue}\n`);
 
        return xirrValue;
    } catch (e) {
        console.error("XIRR calculation error:", e);
        return NaN;
    }
}
 
// Main function with caching logic
async function main() {
    try {
        // Connect to SQL Server
        await connectToSqlServer(config);
 
        // Query all product IDs from the database
        const productIdsResult = await sql.query `
            SELECT DISTINCT PRODUCT_ID
            FROM [dbo].[HRM.LOANS]
        `;
        const productIds = productIdsResult.recordset.map(row => row.PRODUCT_ID);
 
        // Iterate through each product ID
        for (const productId of productIds) {
            // Query data from the database for the current product ID
            const rows = await queryData(productId);
 
            // Calculate XIRR for the retrieved data
            const xirrValue = xirr(rows, productId);
            // Output the XIRR value
            console.log("XIRR for Product ID", productId, ":", xirrValue.toFixed(4)); // Adjust precision as needed
        }
 
        await sql.close();
    } catch (error) {
        console.error('Error:', error);
    }
}
 
// Call the main function
main();
 
// // Function to insert XIRR value into the database
// async function insertXIRRIntoDatabase(productId, xirrValue) {
//     try {
//         // Establish connection to SQL Server (assuming 'config' is defined somewhere)
//         await connectToSqlServer(config);
 
//         // Round the XIRR value to 3 decimal places
//         const roundedXIRR = Math.round(xirrValue * 1000) / 1000; // Rounds to 3 decimal places
 
//         // Execute INSERT query to insert XIRR value into the table
//         await sql.query `
//             INSERT INTO [CBUReportDB].[dbo].[IFRS_ASST_LIAB] ([PRODUCT_ID], [XIRR_RATE])
//             VALUES (${productId}, ${roundedXIRR})
//         `;
 
//         console.log("XIRR value inserted into database for Product ID", productId);
//     } catch (error) {
//         console.error("Error inserting XIRR value into database:", error);
//         throw error;
//     }
// }


// Function to insert XIRR value into the database
async function insertXIRRIntoDatabase(productId, xirrValue) {
    try {
        // Establish connection to SQL Server (assuming 'config' is defined somewhere)
        await connectToSqlServer(config);
 
        // Define current datetime
        const currentDatetime = new Date().toISOString(); // Format: 'YYYY-MM-DDTHH:MM:SSZ'
 
        // Define inputter and authoriser
        const inputter = 'IFRS_USER';
        const authoriser = 'IFRS_USER';
 
        // Round the XIRR value to 3 decimal places
        const roundedXIRR = Math.round(xirrValue * 10000) / 10000; // Rounds to 3 decimal places
 
        // Execute INSERT query to insert XIRR value into the table along with datetime, inputter, and authoriser
        await sql.query `
            INSERT INTO [CBUReportDB].[dbo].[IFRS_ASST_LIAB] ([PRODUCT_ID], [XIRR_RATE], [LAST_CALC_DATE], [INPUTTER], [AUTHORISER])
            VALUES (${productId}, ${roundedXIRR}, ${currentDatetime}, ${inputter}, ${authoriser})
        `;
 
        console.log("XIRR value inserted into database for Product ID", productId);
    } catch (error) {
        console.error("Error inserting XIRR value into database:", error);
        throw error;
    }
}
;




















module.exports = {
    connectToSqlServer: connectToSqlServer
    

};

