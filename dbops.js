var config = require("./dbconfig");
const sql = require ("mssql/msnodesqlv8");

async function getdata(){

try {
let pool = await sql.connect(config);
console.log("sql server connected...");
} catch (error) {
console.log("mathus-error :" + error);

}};

async function getdata_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM haaa10");
         return res.recordsets;
    }    
    catch (error) {
    console.log("mathus-error :" + error);
    
    }};


    
async function getbaldata_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM uc_loan");
         return res.recordsets;
    }    
    catch (error) {
    console.log("mathus-error :" + error);
    
    }};

    async function getloandata_withQuery(){
        try {
            let pool = await sql.connect(config);
            let res = await pool.request().query("SELECT * FROM loan_table");
             return res.recordsets;
        }    
        catch (error) {
        console.log("mathus-error :" + error);
        
        }};

        async function getgldata_withQuery(){
            try {
                let pool = await sql.connect(config);
                let res = await pool.request().query("SELECT * FROM loan_table_gl");
                 return res.recordsets;
            }    
            catch (error) {
            console.log("mathus-error :" + error);
            
            }};

async function getloandeposits_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM [CBUReportDB].[dbo].[LOAN_DEPOSIT]");
         return res.recordsets;
    }    
    catch (error) {
    console.log("mathus-error :" + error);
    
    }};

    
async function getagricloan_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[AGRICULTURAL.LOANS]");
         return res.recordsets;
    }    
    catch (error) {
    console.log("mathus-error :" + error);
    
    }};

    
    
async function getcorporateloan_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[CORPORATE.LOANS]");
         return res.recordsets;
    }    
    catch (error) {
    console.log("mathus-error :" + error);
    
    }};
    
    
async function gethrmloan_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[HRM.LOANS]");
         return res.recordsets;
    }    
    catch (error) {
    console.log("mathus-error :" + error);
    
    }};
    
    
async function getretailloan_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[RETAIL.LOANS]");
         return res.recordsets;
    }    
    catch (error) {
    console.log("mathus-error :" + error);
    
    }};
    
    
async function getsmallbussloan_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[SMALL.BUSS.LOANS]");
         return res.recordsets;
    }    
    catch (error) {
    console.log("mathus-error :" + error);
    
    }};

    async function getsmallbussloan_withQuery(){
        try {
            let pool = await sql.connect(config);
            let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[IFRS_EXTRACT]");
             return res.recordsets;
        }    
        catch (error) {
        console.log("mathus-error :" + error);
        
        }};






////////////////////////////////////////////////////////////////////
// Newton's method for finding roots
// Newton's method for finding roots
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
 
// Calculate Net Present Value (NPV)
function xnpv(rate, values, dates) {
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i] / Math.pow(1 + rate, (dates[i] - dates[0]) / 365);
    }
    return sum;
}
 
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
 
const productId = 'AA240110R854'; // Sample product ID
 
// Function to query data from the database
async function queryData(productId) {
    try {
        const result = await sql.query`
            SELECT DATES, CASH_FLOW_AMT
            FROM [dbo].[HRM.LOANS]
            WHERE PRODUCT_ID = ${productId}
        `;
        // Convert JavaScript dates to Excel serial dates
        const rows = result.recordset.map(row => ({
            CASH_FLOW_AMT: row.CASH_FLOW_AMT,
            DATES: jsDateToExcelSerialDate(new Date(row.DATES))
        }));
        // Print extracted dates and cash flows
        console.log("Extracted Dates and Cash Flows:");
        rows.forEach(row => {
            console.log("Date:", row.DATES, "Cash Flow:", row.CASH_FLOW_AMT);
        });
        return rows;
    } catch (error) {
        console.error("Error querying data:", error);
        throw error;
    }
}
 
// Function to calculate internal rate of return (IRR) as initial guess for XIRR
function calculateIRR(values, dates) {
    // Use a library or an existing implementation to calculate IRR
    // For simplicity, let's assume a fixed initial guess for now
    return 0.1; // You can replace this with a more accurate estimate
}
 
// XIRR calculation
function xirr(rows) {
    try {
        // Extract cash flows and dates from rows
        const cashFlows = rows.map(row => row.CASH_FLOW_AMT);
        const dates = rows.map(row => row.DATES);
 
        // Calculate XIRR using the cash flows and dates
        const initialGuess = calculateIRR(cashFlows, dates);
        console.log("Initial guess for XIRR:", initialGuess);
        const xirrValue = newton(rate => xnpv(rate, cashFlows, dates), initialGuess);
        console.log("Calculated XIRR:", xirrValue);
        return xirrValue;
    } catch (e) {
        console.error("XIRR calculation error:", e);
        return NaN;
    }
}
 

// XNPV calculation
function xnpvCalculation(rows, xirrValue) {
    try {
        // Extract cash flows and dates from rows
        const cashFlows = rows.map(row => row.CASH_FLOW_AMT);
        const dates = rows.map(row => row.DATES);
 
        // Calculate XNPV using XIRR and the extracted cash flows and dates
        const xnpvValue = xnpv(xirrValue, cashFlows, dates);
        console.log("Calculated XNPV:", xnpvValue);
        return xnpvValue;
    } catch (e) {
        console.error("XNPV calculation error:", e);
        return NaN;
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
 
// Function to convert Excel serial date to JavaScript Date object
function excelSerialDateToJSDate(serialDate) {
    const excelStartDate = new Date('1899-12-30');
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const days = Math.floor(serialDate);
    const fraction = serialDate - days;
    const millisecondsSinceStart = (days - 1) * millisecondsInDay + fraction * millisecondsInDay;
    return new Date(excelStartDate.getTime() + millisecondsSinceStart);
}
 
// Main function
async function main() {
    try {
        // Connect to SQL Server
        await connectToSqlServer(config);
        // Query data from the database
        const rows = await queryData(productId);
 
        // Calculate XIRR for the retrieved data
        const xirrValue = xirr(rows);
        // Output the XIRR value
        console.log("XIRR:", xirrValue.toFixed(10)); // Adjust precision as needed
        // Calculate XNPV for the retrieved data
        const xnpvValue = xnpvCalculation(rows, xirrValue);
        // Output the XNPV value
        console.log("XNPV:", xnpvValue.toFixed(2)); // Adjust precision as needed
        // Close the connection
        await sql.close();
    } catch (error) {
        console.error('Error:', error);
    }
}
 
// Call the main function
main();





        
    //     function xnpv(rate, values, dates) {
    //         const dateDiffs = dates.map(date => (date - dates[0]) / 365.0);
    //         let sum = 0;
    //         for (let i = 0; i < values.length; i++) {
    //             sum += values[i] / Math.pow(1 + rate, dateDiffs[i]);
    //         }
    //         return sum;
    //     }


    //  function xirr(values, dates, guess) {
    //         try {
    //             const xirrValue = newton(rate => xnpv(rate, values, dates), guess);
    //             return xirrValue;
    //         } catch (e) {
    //             console.error(e);
    //             return NaN;
    //         }
    //     }
         
    //     // Newton's method implementation
    //     function newton(func, guess) {
    //         let x0 = guess;
    //         let x1;
    //         let f0;
    //         let f1;
    //         const EPSILON = 1e-10;
    //         const MAX_ITERATIONS = 1000;
    //         let iterations = 0;
         
    //         do {
    //             f0 = func(x0);
    //             f1 = derivative(func, x0);
    //             if (f1 === 0) {
    //                 throw new Error("Derivative is zero.");
    //             }
    //             x1 = x0 - f0 / f1;
    //             if (++iterations > MAX_ITERATIONS) {
    //                 throw new Error("Maximum iterations reached.");
    //             }
    //             x0 = x1;
    //         } while (Math.abs(x1 - x0) > EPSILON);
    //         return x1;
    //     }
         
    //     // Derivative calculation for Newton's method
    //     function derivative(func, x) {
    //         const h = 1e-5;
    //         return (func(x + h) - func(x)) / h;
    //     }
           
        
        
    //     const productId = 'AA240110R854'; // Sample product ID

         
    //     (async () => {
    //         try {
    //             // Connect to SQL Server
    //              await sql.connect(config);
         
    //             // Query data from the database for the specified product ID
    //             const result = await sql.query`
    //                 SELECT DATES, CASH_FLOW_AMT
    //                 FROM [dbo].[HRM.LOANS]
    //                 WHERE PRODUCT_ID = ${productId}
    //             `;
         
    //             const rows = result.recordset;
         
    //             // Initialize arrays for values and dates
    //             const values = [];
    //             const dates = [];
         
    //             // Populate arrays with cash flows and dates
    //             for (const row of rows) {
    //                 values.push(row.CASH_FLOW_AMT);
    //                 dates.push(row.DATES.getTime()); // Convert date to milliseconds since Unix epoch
    //             }
         
    //             // Calculate XIRR for the values and dates
    //             const xirrValue = xirr(values, dates, 0.1);
    //             console.log("XIRR:", xirrValue);
         
    //             // Close the connection
    //             await sql.close();
    //         } catch (error) {
    //             console.error('Error:', error);
    //         }

    //     })();

module.exports = {
    getdata: getdata,
    getdata_withQuery: getdata_withQuery,
    getagricloan_withQuery:getagricloan_withQuery, 
    getcorporateloan_withQuery:getcorporateloan_withQuery,
    gethrmloan_withQuery:gethrmloan_withQuery,
    getretailloan_withQuery:getretailloan_withQuery,
    getsmallbussloan_withQuery:getsmallbussloan_withQuery,
    getloandeposits_withQuery:getloandeposits_withQuery,
    getbaldata_withQuery:getbaldata_withQuery,
    getloandata_withQuery:getloandata_withQuery,
    getgldata_withQuery:getgldata_withQuery,
    // xirr:xirr,
    // xnpv:xnpv
    connectToSqlServer:connectToSqlServer
    // queryData:queryData

};
