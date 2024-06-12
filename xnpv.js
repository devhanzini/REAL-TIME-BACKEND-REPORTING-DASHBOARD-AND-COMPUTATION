// // Import required libraries and modules
// const sql = require('mssql');
 
// // Function to connect to SQL Server
// async function connectToSqlServer(config) {
//     try {
//         await sql.connect(config);
//         console.log("Connected to SQL Server");
//     } catch (error) {
//         console.error("Error connecting to SQL Server:", error);
//         throw error;
//     }
// }
 
// // Function to query XIRR rate from the database for a specific product ID
// async function queryXIRRRate(productId) {
//     try {
//         const result = await sql.query`
//             SELECT XIRR_RATE
//             FROM [CBUReportDB].[dbo].[IFRS_ASST_LIAB]
//             WHERE PRODUCT_ID = ${productId}
//         `;
//         console.log("XIRR rate queried successfully");
//         return result.recordset[0].XIRR_RATE;
//     } catch (error) {
//         console.error("Error querying XIRR rate:", error);
//         throw error;
//     }
// }
 
// // Function to query cash flows and dates from the database for a specific product ID
// async function queryCashFlowsAndDates(productId) {
//     try {
//         const result = await sql.query`
//             SELECT DATE, CASH_FLOW_AMT
//             FROM [dbo].[HRM.LOANS]
//             WHERE PRODUCT_ID = ${productId}
//             ORDER BY DATE
//         `;
//         console.log("Cash flows and dates queried successfully");
//         return result.recordset.map(row => ({
//             CASH_FLOW_AMT: parseFloat(row.CASH_FLOW_AMT), // Parse the cash flow amount to float
//             DATE: row.DATE
//         }));
//     } catch (error) {
//         console.error("Error querying cash flows and dates:", error);
//         throw error;
//     }
// }
 
// // Function to convert JavaScript Date object to Excel serial date
// function jsDateToExcelSerialDate(date) {
//     const excelStartDate = new Date('1899-12-30');
//     const millisecondsInDay = 24 * 60 * 60 * 1000;
//     const daysSinceStart = Math.floor((date - excelStartDate) / millisecondsInDay);
//     const fractionOfDay = date.getHours() / 24 + date.getMinutes() / (24 * 60) + date.getSeconds() / (24 * 60 * 60);
//     const excelSerialDate = daysSinceStart + fractionOfDay;
//     return excelSerialDate;
// }
 
// // Function to calculate Net Present Value (XNPV) with caching and memory for dates and cash flows
// function xnpv(rate, cashFlows, dates, productId) {
//     // Filter out only the payment dates and corresponding cash flows
//     const paymentsData = cashFlows.map((flow, index) => ({ flow, date: dates[index] })).filter(({ flow }) => flow < 0);
 
//     let sum = 0;
//     let prevDate = paymentsData[0].date;
//     let disbursementAmount = -paymentsData[0].flow; // First negative amount is the disbursement amount
//     let principal = 0;
//     let interest = 0;
 
//     // Load last computed date from cache or initialize it to the earliest date if not present
//     let lastComputedDate = xnpvCache[productId] ? xnpvCache[productId].lastComputedDate : new Date('1899-12-30');
 
//     // Iterate through payment data to calculate XNPV for new dates only
//     paymentsData.forEach(({ date, flow }) => {
//         if (date > lastComputedDate) {
//             // If the date is different from the previous date, add cash flow to the sum
//             if (date !== prevDate) {
//                 sum += (disbursementAmount + principal + interest) / Math.pow(1 + rate, (date - prevDate) / 365);
//                 principal = 0;
//                 interest = 0;
//                 prevDate = date;
//             }
//             // Separate principal and interest cash flows (excluding the disbursement amount)
//             if (flow < 0) {
//                 interest += flow;
//             } else {
//                 principal += flow;
//             }
//         }
//     });
 
//     // Add the final cash flow after the last payment date
//     sum += (disbursementAmount + principal + interest) / Math.pow(1 + rate, (prevDate - paymentsData[paymentsData.length - 1].date) / 365);
 
//     // Update the last computed date in the cache
//     xnpvCache[productId] = { lastComputedDate: prevDate };
 
//     return sum;
// }
 
// // Main function
// async function main() {
//     try {
//         // Define sample product ID
//         const productId = 'AA240110R854';
 
//         // Connection configuration for SQL Server
//         const config = {
//             user: 'username',
//             password: 'password',
//             server: 'localhost',
//             database: 'your_database'
//         };
 
//         // Connect to SQL Server
//         await connectToSqlServer(config);
 
//         // Query XIRR rate for the product ID from the database
//         console.log("Querying XIRR rate...");
//         const xirrRate = await queryXIRRRate(productId);
 
//         // Query cash flows and dates for the product ID from the database
//         console.log("Querying cash flows and dates...");
//         const cashFlowsAndDates = await queryCashFlowsAndDates(productId);
 
//         // Extract cash flows and dates
//         const cashFlows = cashFlowsAndDates.map(row => row.CASH_FLOW_AMT);
//         const dates = cashFlowsAndDates.map(row => row.DATE);
 
//         // Calculate XNPV for the retrieved data
//         console.log("Calculating XNPV...");
//         const xnpvValue = xnpv(xirrRate, cashFlows, dates, productId);
 
//         // Output the date of computation, cash flows, and XNPV value
//         console.log("Date of Computation:", new Date());
//         console.log("Cash Flows:", cashFlows);
//         console.log("XNPV:", xnpvValue.toFixed(2)); // Adjust precision as needed
 
//         // Close the connection
//         await sql.close();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }
 
// // Call the main function
// main();