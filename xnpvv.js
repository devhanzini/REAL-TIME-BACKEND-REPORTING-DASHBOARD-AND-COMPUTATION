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




































const path = require('path');
const cron = require('node-cron');

 



// Global cache for storing computed dates and their corresponding cash flows
let dateCashFlowCache = {};

// Function to connect to SQL Server
async function connectToSqlServer(config, logs) {
    try {
        await sql.connect(config);
        logs.push("Connected to SQL Server");
    } catch (error) {
        logs.push(`Error connecting to SQL Server: ${error.message}`);
        throw error;
    }
}

// Function to query XIRR rate from the database for a specific product ID
async function queryXIRRRate(productId, logs) {
    try {
        logs.push(`Querying XIRR rate for Product ID: ${productId}`);
        const result = await sql.query`
            SELECT XIRR_RATE
            FROM [CBUReportDB].[dbo].[IFRS_XIRR_RATE]
            WHERE PRODUCT_ID = ${productId}
        `;
        if (result.recordset.length === 0) {
            throw new Error(`No XIRR rate found for Product ID: ${productId}`);
        }
        logs.push("XIRR rate queried successfully");
        return result.recordset[0].XIRR_RATE;
    } catch (error) {
        logs.push(`Error querying XIRR rate for Product ID: ${productId}: ${error.message}`);
        throw error;
    }
}

// Function to query data from the database with caching
async function queryData(productId, logs) {
    try {
        // Check cache first
        if (dateCashFlowCache.hasOwnProperty(productId) && dateCashFlowCache[productId].hasOwnProperty("data")) {
            logs.push(`Using cached data for Product ID: ${productId}`);
            return dateCashFlowCache[productId].data;
        }

        // If not in cache, query data from the database
        logs.push(`Querying data from the database for Product ID: ${productId}`);
        const result = await sql.query`
            SELECT
                CASH_FLOW_DATE AS DATE,
                SUM(
                    CASE
                        WHEN PRINCIPAL_PAYMENT <> '0' OR INTEREST_PAYMENT <> '0' THEN
                            COALESCE(NULLIF(CAST(PRINCIPAL_PAYMENT AS DECIMAL(18, 2)), '0.00'), 0) +
                            COALESCE(NULLIF(CAST(INTEREST_PAYMENT AS DECIMAL(18, 2)), '0.00'), 0)
                        ELSE
                            0
                    END
                ) AS CASH_FLOW_AMT
            FROM
                [dbo].[LOANS.DEPOSIT]
            WHERE
                PRODUCT_ID = ${productId}
            GROUP BY
                CASH_FLOW_DATE
            ORDER BY
                CASH_FLOW_DATE;
        `;

        // Convert JavaScript dates to Excel serial dates
        const rows = result.recordset.map(row => ({
            CASH_FLOW_AMT: parseFloat(row.CASH_FLOW_AMT),
            DATE: jsDateToExcelSerialDate(new Date(row.DATE))
        }));

        // Cache the data
        dateCashFlowCache[productId] = { data: rows };

        // Print extracted dates and cash flows
        logs.push(`Extracted Dates and Cash Flows for Product ID: ${productId}`);
        logs.push(JSON.stringify(rows, null, 2));

        return rows;
    } catch (error) {
        logs.push(`Error querying data for Product ID: ${productId}: ${error.message}`);
        throw error;
    }
}

// XNPV calculation with caching for computation dates
function xnpv(xirrRate, cashFlows, dates, computationDate, productId, logs) {
    // Initialize sum of outstanding cash flows and sum of dates
    let sumOfCashFlows = 0;
    let sumOfDates = 0;
    let computationDateIndex = dates.indexOf(computationDate);

    // Check cache for previously computed dates
    if (dateCashFlowCache.hasOwnProperty(productId) && dateCashFlowCache[productId].hasOwnProperty("lastComputedDate")) {
        const lastComputedDate = dateCashFlowCache[productId].lastComputedDate;
        // Find the index of the last computed date
        computationDateIndex = dates.findIndex(date => date === lastComputedDate);
        if (computationDateIndex === -1) {
            computationDateIndex = 0; // If not found, start from the beginning
        } else {
            computationDateIndex++; // Start from the next date
        }
    }

    // If the computation date is at index 0, set XNPV value to zero
    if (computationDateIndex === 0) {
        return {
            xirrRate: xirrRate,
            sumOfCashFlows: sumOfCashFlows,
            sumOfDates: sumOfDates,
            xnpvValue: 0
        };
    }

    // Iterate over cash flows and dates
    cashFlows.forEach((flow, i) => {
        // Exclude disbursement and charge fee from cash flows
        if (i === computationDateIndex) {
            cashFlows[i] = 0; // Set cash flow amount for the first repayment date to zero
        } else if (i > computationDateIndex) {
            sumOfCashFlows += flow / Math.pow(1 + xirrRate, (dates[i] - dates[computationDateIndex]) / 365);
        }
    });

    // Sum the dates from computationDateIndex to last date
    for (let i = computationDateIndex; i < dates.length; i++) {
        sumOfDates += (dates[i] - dates[computationDateIndex]) / 365;
    }

    // Calculate XNPV
    const xnpvValue = sumOfCashFlows;
    logs.push(`XNPV for Product ID: ${productId} at Computation Date: ${computationDate} is ${xnpvValue}`);

    // Update cache with the last computed date
    dateCashFlowCache[productId].lastComputedDate = computationDate;

    return {
        xirrRate: xirrRate,
        sumOfCashFlows: sumOfCashFlows,
        sumOfDates: sumOfDates,
        xnpvValue: xnpvValue
    };
}

// Function to convert JavaScript Date object to Excel serial date
function jsDateToExcelSerialDate(date) {
    const excelStartDate = new Date('1899-12-30');
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const daysSinceStart = Math.floor((date - excelStartDate) / millisecondsInDay);
    const fractionOfDay = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / (24 * 60 * 60);
    const excelSerialDate = daysSinceStart + fractionOfDay;
    return excelSerialDate;
}

// Main function
async function mainn(productId) {
    const logs = [];
    try {
        await connectToSqlServer(config, logs);

        const xirrRate = await queryXIRRRate(productId, logs);
        const data = await queryData(productId, logs);
        const cashFlows = data.map(row => row.CASH_FLOW_AMT);
        const dates = data.map(row => row.DATE);

        let lastComputedDate = null;
        if (dateCashFlowCache.hasOwnProperty(productId) && dateCashFlowCache[productId].hasOwnProperty("lastComputedDate")) {
            lastComputedDate = dateCashFlowCache[productId].lastComputedDate;
        }

        let nextComputationDate = null;
        if (lastComputedDate) {
            const lastDateIndex = dates.indexOf(lastComputedDate);
            if (lastDateIndex !== -1 && lastDateIndex < dates.length - 1) {
                nextComputationDate = dates[lastDateIndex + 1];
            }
        } else {
            nextComputationDate = dates[1];
        }

        if (nextComputationDate) {
            const xnpvResult = xnpv(xirrRate, cashFlows.slice(), dates.slice(), nextComputationDate, productId, logs);
            const xnpvValues = {
                "Product ID": productId,
                "XNPV Value": xnpvResult.xnpvValue,
                "XIRR Rate": xnpvResult.xirrRate,
                "Sum of Cash Flows": xnpvResult.sumOfCashFlows,
                "Sum of Dates": xnpvResult.sumOfDates,
                "Dates and Cash Flows": data, // Add the dates and cash flows to the result
                // logs: logs // Include the logs in the result
            };
            logs.push("Computed XNPV values:", JSON.stringify(xnpvValues, null, 2));

            dateCashFlowCache[productId] = { lastComputedDate: nextComputationDate }; // Update the cache

            return xnpvValues;
        } else {
            logs.push(`No new computation date available for Product ID: ${productId}`);
            return { message: "No new computation date available", logs: logs };
        }
    } catch (error) {
        logs.push(`An error occurred: ${error.message}`);
        throw error;
    } finally {
        try {
            await sql.close();
            logs.push("Connection closed successfully");
        } catch (error) {
            logs.push(`Error closing SQL Server connection: ${error.message}`);
        }
    }
}

// Function to handle front-end request for a specific product ID
async function handleRequest(productId) {
    try {
        const xnpvValues = await mainn(productId);
        console.log("Rendered XNPV values to the front end:", xnpvValues);
        return xnpvValues;
    } catch (error) {
        console.error("Error handling request:", error.message);
        throw error;
    }
}



// Schedule to run the main function on a monthly basis (optional, if needed)
cron.schedule('0 0 1 * *', () => {
    const productId = 'your_product_id'; // Replace with the product ID for scheduled tasks
    handleRequest(productId).then(values => {
        console.log("Scheduled task rendered values:", values);
    }).catch(error => {
        console.error("Scheduled task error:", error.message);
    });
});




module.exports = {
    // calculateIRR:calculateIRR,
    // xirr:xirr,
    // main:main,
    mainn :mainn ,
    handleRequest,handleRequest,
    // queryXIRRRate:queryXIRRRate,
    // calculateAndInsertXIRR:calculateAndInsertXIRR,
    connectToSqlServer:connectToSqlServer,



};

