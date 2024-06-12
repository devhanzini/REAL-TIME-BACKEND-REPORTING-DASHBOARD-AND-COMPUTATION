


////////////////////////////////////////////////////////////////////

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
        SELECT
        CASH_FLOW_DATE AS DATE,
                SUM(
                    COALESCE(NULLIF(CAST(DISBURSEMENT AS DECIMAL(18, 2)), '0.00'), 0) +
                    COALESCE(NULLIF(CAST(PRINCIPAL_PAYMENT AS DECIMAL(18, 2)), '0.00'), 0) +
                    COALESCE(NULLIF(CAST(INTEREST_PAYMENT AS DECIMAL(18, 2)), '0.00'), 0) +
                    COALESCE(NULLIF(CAST(CHARGE_FEE AS DECIMAL(18, 2)), '0.00'), 0)
                ) AS CASH_FLOW_AMT
            FROM
                [dbo].[HRM.LOANS]
            WHERE
                PRODUCT_ID = ${productId}
                AND (DISBURSEMENT <> '0' OR PRINCIPAL_PAYMENT <> '0' OR INTEREST_PAYMENT <> '0' OR CHARGE_FEE <> '0')
            GROUP BY
                CASH_FLOW_DATE
            ORDER BY
                CASH_FLOW_DATE;
        `;
        // Convert JavaScript dates to Excel serial dates
        const rows = result.recordset.map(row => ({
            CASH_FLOW_AMT: parseFloat(row.CASH_FLOW_AMT), // Parse the cash flow amount to float
            DATE: jsDateToExcelSerialDate(new Date(row.DATE))
        }));
        // Print extracted dates and cash flows
        console.log("Extracted Dates and Cash Flows:");
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
async function xirr(rows, productId) {
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
        console.log("Initial guess for XIRR:", initialGuess);
        const xirrValue = newton(rate => xnpv(rate, cashFlows, dates), initialGuess);
        console.log("Calculated XIRR:", xirrValue);
 
        
        // Store the calculated XIRR value in the cache
        xirrCache[cacheKey] = xirrValue;
 

        
            // Insert XIRR value into the database
            await insertXIRRIntoDatabase (productId, xirrValue);

        return xirrValue;
    } catch (e) {
        console.error("XIRR calculation error:", e);
        return NaN;
    }
}
 
// // XNPV calculation
// function xnpvCalculation(rows, xirrValue) {
//     try {
//         // Extract cash flows and dates from rows
//         const cashFlows = rows.map(row => row.CASH_FLOW_AMT);
//         const dates = rows.map(row => row.DATE);
 
//         // Calculate XNPV using XIRR and the extracted cash flows and dates
//         const xnpvValue = xnpv(xirrValue, cashFlows, dates);
//         console.log("Calculated XNPV:", xnpvValue);
//         return xnpvValue;
//     } catch (e) {
//         console.error("XNPV calculation error:", e);
//         return NaN;
//     }
// }


 
// Main function with caching logic
async function main() {
    try {
        // Define sample product ID
        const productId = 'AA240110R854';
 
        // Connect to SQL Server
        await connectToSqlServer(config);
 
        // Query data from the database
        const rows = await queryData(productId);
 
        // Calculate XIRR for the retrieved data
        const xirrValue = xirr(rows, productId);
        // Output the XIRR value
        console.log("XIRR:", xirrValue.toFixed(4)); // Adjust precision as needed
        // Calculate XNPV for the retrieved data
        // const xnpvValue = xnpvCalculation(rows, xirrValue);
        // // Output the XNPV value
        // console.log("XNPV:", xnpvValue.toFixed(2)); // Adjust precision as needed
        // Close the connection
        await sql.close();
    } catch (error) {
        console.error('Error:', error);
    }
}
 
// Call the main function
main();
// Function to insert XIRR value into the database
async function insertXIRRIntoDatabase(productId, xirrValue) {
    try {
        // Establish connection to SQL Server (assuming 'config' is defined somewhere)
        await connectToSqlServer(config);
 
        // Round the XIRR value to 4 decimal places
        const roundedXIRR = Math.round(xirrValue * 10000) / 10000; // Rounds to 4 decimal places
 
        // Execute INSERT query to insert XIRR value into the table
        await sql.query `
            INSERT INTO [CBUReportDB].[dbo].[IFRS_ASST_LIAB] ([PRODUCT_ID], [XIRR_RATE])
            VALUES (${productId}, ${roundedXIRR})
        `;
 
        console.log("XIRR value inserted into database for Product ID", productId);
    } catch (error) {
        console.error("Error inserting XIRR value into database:", error);
        throw error;
    }
}
