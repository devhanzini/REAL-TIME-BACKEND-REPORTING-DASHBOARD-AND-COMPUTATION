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


/////////////////////////////////////////////////////////////////////////////////////////////////
async function runhrmstored_withQuery() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("EXECUTE HRM_Lending_Products ");
        //  return res.recordsets;
        console.log("HRM LOADED");
    } catch (error) {
        console.log("mathus-error :" + error);

    }
};

async function runsmallstored_withQuery() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("EXECUTE Small_Lending_Products  ");
        //  return res.recordsets;
        console.log("SMALL BUSINESS LOAN LOADED");
    } catch (error) {
        console.log("mathus-error :" + error);

    }
};


async function runretailstored_withQuery() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("EXECUTE Retail_Lending_Products ");
        //  return res.recordsets;
        console.log("RETAIL LOADED");
    } catch (error) {
        console.log("mathus-error :" + error);

    }
};


async function runcorporatestored_withQuery() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("EXECUTE Corporate_Lending_Products ");
        //  return res.recordsets;
        console.log("CORPORATE LOADED");
    } catch (error) {
        console.log("mathus-error :" + error);

    }
};

async function runagricstored_withQuery() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("EXECUTE Agric_Lending_Products ");
        //  return res.recordsets;
        console.log("CORPORATE LOADED");
    } catch (error) {
        console.log("mathus-error :" + error);

    }
};



async function getbaldata_withQuery() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM uc_loan");
        return res.recordsets;
    } catch (error) {
        console.log("mathus-error :" + error);

    }
};

const { ConnectionPool } = require('mssql');


async function getagricloan_withQuery() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[AGRICULTURAL.LOANS]");
        return res.recordsets;
    } catch (error) {
        console.log("mathus-error :" + error);

    }
};


async function getsmallbussloan_withQuery() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[SMALL.BUSS.LOANS]");
        return res.recordsets;
    } catch (error) {
        console.log("mathus-error :" + error);

    }
};







async function gethrmloan_withQuery(offset, limit) {
    try {
        let pool = await sql.connect(config);

        // Fetch total count of rows
        let totalCountQuery = `SELECT COUNT(*) AS TotalCount FROM [CBUReportDB].[dbo].[HRM.LOANS]`;
        let totalCountRes = await pool.request().query(totalCountQuery);
        let totalCount = totalCountRes.recordset[0].TotalCount;

        // Calculate start and end indexes for pagination
        let startIdx = offset;
        let endIdx = Math.min(offset + limit, totalCount);

        // Fetch paginated data
        let res = await pool.request()
            .query(`SELECT * FROM (
                            SELECT *, ROW_NUMBER() OVER (ORDER BY product_id) AS RowNum 
                            FROM [CBUReportDB].[dbo].[HRM.LOANS]
                        ) AS Sub
                        WHERE RowNum > ${startIdx} AND RowNum <= ${endIdx}`);

        let data = res.recordset || [];

        return {
            totalCount: totalCount,
            startIdx: startIdx,
            endIdx: endIdx,
            data: data
        };
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
};






async function getloandeposits_withQuery() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM [CBUReportDB].[dbo].[LOAN_DEPOSIT]");
        return res.recordsets;
    } catch (error) {
        console.log("mathus-error :" + error);

    }
};






async function getloandata_withQuery(offset, limit) {
    try {
        let pool = await sql.connect(config);

        // Fetch total count of rows
        let totalCountQuery = `SELECT COUNT(*) AS TotalCount FROM [CBUReportDB].[dbo].[IFRS_SUMMARY]`;
        let totalCountRes = await pool.request().query(totalCountQuery);
        let totalCount = totalCountRes.recordset[0].TotalCount;

        // Calculate start and end indexes for pagination
        let startIdx = offset;
        let endIdx = Math.min(offset + limit, totalCount);

        // Fetch paginated data
        let res = await pool.request()
            .query(`SELECT * FROM (
                        SELECT *, ROW_NUMBER() OVER (ORDER BY header) AS RowNum 
                        FROM [CBUReportDB].[dbo].[IFRS_SUMMARY]
                    ) AS Sub
                    WHERE RowNum > ${startIdx} AND RowNum <= ${endIdx}`);

        let data = res.recordset || [];

        return {
            totalCount: totalCount,
            startIdx: startIdx,
            endIdx: endIdx,
            data: data
        };
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
};














async function getcorporateloan_withQuery(offset, limit) {
    try {
        let pool = await sql.connect(config);

        // Fetch total count of rows
        let totalCountQuery = `SELECT COUNT(*) AS TotalCount FROM [CBUReportDB].[dbo].[CORPORATE.LOANS]`;
        let totalCountRes = await pool.request().query(totalCountQuery);
        let totalCount = totalCountRes.recordset[0].TotalCount;

        // Calculate start and end indexes for pagination
        let startIdx = offset;
        let endIdx = Math.min(offset + limit, totalCount);

        // Fetch paginated data
        let res = await pool.request()
            .query(`SELECT * FROM (
                        SELECT *, ROW_NUMBER() OVER (ORDER BY product_id) AS RowNum 
                        FROM [CBUReportDB].[dbo].[CORPORATE.LOANS]
                    ) AS Sub
                    WHERE RowNum > ${startIdx} AND RowNum <= ${endIdx}`);

        let data = res.recordset || [];

        return {
            totalCount: totalCount,
            startIdx: startIdx,
            endIdx: endIdx,
            data: data
        };
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
};










async function getxirr_rate_withQuery(offset, limit) {
    try {
        let pool = await sql.connect(config);

        // Fetch total count of rows
        let totalCountQuery = `SELECT COUNT(*) AS TotalCount FROM [CBUReportDB].[dbo].[IFRS_XIRR_RATE]`;
        let totalCountRes = await pool.request().query(totalCountQuery);
        let totalCount = totalCountRes.recordset[0].TotalCount;

        // Calculate start and end indexes for pagination
        let startIdx = offset;
        let endIdx = Math.min(offset + limit, totalCount);

        // Fetch paginated data
        let res = await pool.request()
            .query(`SELECT * FROM (
                        SELECT *, ROW_NUMBER() OVER (ORDER BY product_id) AS RowNum 
                        FROM [CBUReportDB].[dbo].[IFRS_XIRR_RATE]
                    ) AS Sub
                    WHERE RowNum > ${startIdx} AND RowNum <= ${endIdx}`);

        let data = res.recordset || [];

        return {
            totalCount: totalCount,
            startIdx: startIdx,
            endIdx: endIdx,
            data: data
        };
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
};


















async function getretailloan_withQuery(offset, limit) {
    try {
        let pool = await sql.connect(config);

        // Fetch total count of rows
        let totalCountQuery = `SELECT COUNT(*) AS TotalCount FROM [CBUReportDB].[dbo].[RETAIL.LOANS]`;
        let totalCountRes = await pool.request().query(totalCountQuery);
        let totalCount = totalCountRes.recordset[0].TotalCount;

        // Calculate start and end indexes for pagination
        let startIdx = offset;
        let endIdx = Math.min(offset + limit, totalCount);

        // Fetch paginated data
        let res = await pool.request()
            .query(`SELECT * FROM (
                        SELECT *, ROW_NUMBER() OVER (ORDER BY product_id) AS RowNum 
                        FROM [CBUReportDB].[dbo].[RETAIL.LOANS]
                    ) AS Sub
                    WHERE RowNum > ${startIdx} AND RowNum <= ${endIdx}`);

        let data = res.recordset || [];

        return {
            totalCount: totalCount,
            startIdx: startIdx,
            endIdx: endIdx,
            data: data
        };
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
};








async function gettermdeposits_withQuery(offset, limit) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request()
            .query(`SELECT * FROM (
                        SELECT *, ROW_NUMBER() OVER (ORDER BY product_id) AS RowNum 
                        FROM [CBUReportDB].[dbo].[TERM.DEPOSITS.LOANS]
                    ) AS Sub
                    WHERE RowNum > ${offset} AND RowNum <= ${offset + limit}`);
        return res.recordset || [];
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
};






async function getifrsprofitloss_withQuery(offset, limit) {
    try {
        let pool = await sql.connect(config);

        // Fetch total count of rows
        let totalCountQuery = `SELECT COUNT(*) AS TotalCount FROM [CBUReportDB].[dbo].[IFRS_EXTRACT]`;
        let totalCountRes = await pool.request().query(totalCountQuery);
        let totalCount = totalCountRes.recordset[0].TotalCount;

        // Calculate start and end indexes for pagination
        let startIdx = offset;
        let endIdx = Math.min(offset + limit, totalCount);

        // Fetch paginated data
        let res = await pool.request()
            .query(`SELECT * FROM (
                        SELECT *, ROW_NUMBER() OVER (ORDER BY DATE) AS RowNum 
                        FROM [CBUReportDB].[dbo].[IFRS_EXTRACT]
                    ) AS Sub
                    WHERE RowNum > ${startIdx} AND RowNum <= ${endIdx}`);

        let data = res.recordset || [];

        return {
            totalCount: totalCount,
            startIdx: startIdx,
            endIdx: endIdx,
            data: data
        };
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
};







async function getspecialdeposits_withQuery(offset, limit) {
    try {
        let pool = await sql.connect(config);

        // Fetch total count of rows
        let totalCountQuery = `SELECT COUNT(*) AS TotalCount FROM [CBUReportDB].[dbo].[SPECILIZED.DEPOSITS]`;
        let totalCountRes = await pool.request().query(totalCountQuery);
        let totalCount = totalCountRes.recordset[0].TotalCount;

        // Calculate start and end indexes for pagination
        let startIdx = offset;
        let endIdx = Math.min(offset + limit, totalCount);

        // Fetch paginated data
        let res = await pool.request()
            .query(`SELECT * FROM (
                        SELECT *, ROW_NUMBER() OVER (ORDER BY product_id) AS RowNum 
                        FROM [CBUReportDB].[dbo].[SPECILIZED.DEPOSITS]
                    ) AS Sub
                    WHERE RowNum > ${startIdx} AND RowNum <= ${endIdx}`);

        let data = res.recordset || [];

        return {
            totalCount: totalCount,
            startIdx: startIdx,
            endIdx: endIdx,
            data: data
        };
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
};





async function getotherdeposits_withQuery(offset, limit) {
    try {
        let pool = await sql.connect(config);

        // Fetch total count of rows
        let totalCountQuery = `SELECT COUNT(*) AS TotalCount FROM [CBUReportDB].[dbo].[TERM.DEPOSITS.STR.OTHERS]`;
        let totalCountRes = await pool.request().query(totalCountQuery);
        let totalCount = totalCountRes.recordset[0].TotalCount;

        // Calculate start and end indexes for pagination
        let startIdx = offset;
        let endIdx = Math.min(offset + limit, totalCount);

        // Fetch paginated data
        let res = await pool.request()
            .query(`SELECT * FROM (
                        SELECT *, ROW_NUMBER() OVER (ORDER BY product_id) AS RowNum 
                        FROM [CBUReportDB].[dbo].[TERM.DEPOSITS.STR.OTHERS]
                    ) AS Sub
                    WHERE RowNum > ${startIdx} AND RowNum <= ${endIdx}`);

        let data = res.recordset || [];

        return {
            totalCount: totalCount,
            startIdx: startIdx,
            endIdx: endIdx,
            data: data
        };
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
};











async function getifrsassetliab_withQuery(offset, limit) {
    try {
        let pool = await sql.connect(config);

        // Fetch total count of rows
        let totalCountQuery = `SELECT COUNT(*) AS TotalCount FROM [CBUReportDB].[dbo].[IFRS_ASST_LIAB]`;
        let totalCountRes = await pool.request().query(totalCountQuery);
        let totalCount = totalCountRes.recordset[0].TotalCount;

        // Calculate start and end indexes for pagination
        let startIdx = offset;
        let endIdx = Math.min(offset + limit, totalCount);

        // Fetch paginated data
        let res = await pool.request()
            .query(`SELECT * FROM (
                        SELECT *, ROW_NUMBER() OVER (ORDER BY product_id) AS RowNum 
                        FROM [CBUReportDB].[dbo].[IFRS_ASST_LIAB]
                    ) AS Sub
                    WHERE RowNum > ${startIdx} AND RowNum <= ${endIdx}`);

        let data = res.recordset || [];

        return {
            totalCount: totalCount,
            startIdx: startIdx,
            endIdx: endIdx,
            data: data
        };
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
};









// productService.js
async function getProductById(productId) {
    try {
        // Your code to fetch product details by ID
        const result = await pool.request()
            .input('productId', sql.VarChar, productId)
            .query(`SELECT * FROM [CBUReportDB].[dbo].[SMALL.BUSS.LOANS] WHERE ProductId = @productId`);

        // Log the fetched product data
        console.log('Fetched product data:', result.recordset[0]);

        // Return the fetched product data
        return result.recordset[0]; // Assuming only one product will match the ID
    } catch (error) {
        throw new Error(`Error fetching product details: ${error.message}`);
    }
}

module.exports = getProductById;





































async function getTotalCount() {
    try {
        // Implement your logic to get the total count of rows from the database
        const countResult = await sql.query('SELECT COUNT(*) AS total FROM your_table_name');
        const totalCount = countResult[0].total;
        return totalCount;
    } catch (err) {
        throw err;
    }
}

async function getTotalPagesAndCount() {
    try {
        const totalCount = await getTotalCount();
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        return { totalPages, totalCount };
    } catch (err) {
        throw err;
    }
}









async function fetchDataFromDatabase() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[AGRICULTURAL.LOANS]");
        return res.recordsets[0]; // assuming only one recordset
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}




async function fetchDataFromHrm() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[HRM.LOANS]");
        return res.recordsets[0]; // assuming only one recordset
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}



async function fetchDataFromSmall() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[SMALL.BUSS.LOANS]");
        return res.recordsets[0]; // assuming only one recordset
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}



async function fetchDataFromRetail() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[RETAIL.LOANS]");
        return res.recordsets[0]; // assuming only one recordset
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}



async function fetchDataFromSpecial() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[SPECILIZED.DEPOSITS]");
        return res.recordsets[0]; // assuming only one recordset
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}




async function fetchDataFromSummary() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[IFRS_SUMMARY]");
        return res.recordsets[0]; // assuming only one recordset
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}



async function fetchDataFromIfrsAssetLiab() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[IFRS_ASST_LIAB]");
        return res.recordsets[0]; // assuming only one recordset
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}




async function fetchDataFromSearch(product_id) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request()
            .input('product_id', sql.NVarChar, product_id)
            .query("SELECT * FROM [LOAN_DEPOSIT] WHERE product_id = @product_id");

        return res.recordsets[0]; // assuming only one recordset
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}


async function fetchDataFromIfrsProfitLoss() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[IFRS_EXTRACT]");
        return res.recordsets[0]; // assuming only one recordset
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}



// const sql = require('mssql');
const XLSX = require('xlsx');

async function fetchDataFromCorporate() {
    try {
        let pool = await sql.connect(config);
        let offset = 0;
        let limit = 10000; // Adjust this based on your needs
        let sheetIndex = 1;
        let workbook = XLSX.utils.book_new();

        while (true) {
            let res = await pool.request().query(`SELECT * FROM [CBUReportDB].[dbo].[CORPORATE.LOANS] ORDER BY [PRODUCT_ID] OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`);

            if (res.recordsets[0].length === 0) break; // No more data

            let worksheet = XLSX.utils.json_to_sheet(res.recordsets[0]);
            XLSX.utils.book_append_sheet(workbook, worksheet, `Sheet${sheetIndex}`);

            offset += limit;
            sheetIndex++;
        }

        XLSX.writeFile(workbook, 'corporate_loans.xlsx');
        console.log("Data exported successfully.");
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}




















async function fetchDataFromTerm() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[TERM.DEPOSITS.LOANS]");
        return res.recordsets[0]; // assuming only one recordset
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}





async function fetchDataFromOthers() {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[TERM.DEPOSITS.STR.OTHERS]");
        return res.recordsets[0]; // assuming only one recordset
    } catch (error) {
        console.log("Error fetching data:", error);
        throw error;
    }
}




















async function getProductDetailsById(product_id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('product_id', sql.NVarChar, product_id)
            .query("SELECT * FROM [LOAN_DEPOSIT] WHERE product_id = @product_id");
        return result.recordset;
    } catch (error) {
        console.error("Error fetching product details:", error);
        throw error;
    }
}


async function computeXirrById(product_id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('product_id', sql.NVarChar, product_id)
            .query("SELECT * FROM [IFRS_ASST_LIAB] WHERE product_id = @product_id");
        return result.recordset;
    } catch (error) {
        console.error("Error fetching product details:", error);
        throw error;
    }
}















async function computeXirrProduct(productId) {
    return new Promise((resolve, reject) => {
        fs.readFile('/xirr_cache.txt', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const lines = data.trim().split('\n');
                for (const line of lines) {
                    const [id, name] = line.split(',');
                    if (id === productId) {
                        resolve(name);
                        return;
                    }
                }
                resolve(null); // Product not found
            }
        });
    });
}

// Async function to handle search by user input
async function computeXirrProductByInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter product ID: ", async(productId) => {
        const productName = await computeXirrProduct(productId);
        if (productName) {
            console.log(`Product found: ${productName}`);
        } else {
            console.log("Product not found");
        }
        rl.close();
    });
}






async function computeXnpvProduct(productId) {
    return new Promise((resolve, reject) => {
        fs.readFile('/all_product_data.bin', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const lines = data.trim().split('\n');
                for (const line of lines) {
                    const [id, name] = line.split(',');
                    if (id === productId) {
                        resolve(name);
                        return;
                    }
                }
                resolve(null); // Product not found
            }
        });
    });
}

// Async function to handle search by user input
async function computeXnpvProductByInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter product ID: ", async(productId) => {
        const productName = await computeXnpvProduct(productId);
        if (productName) {
            console.log(`Product found: ${productName}`);
        } else {
            console.log("Product not found");
        }
        rl.close();
    });
}










// Assuming you have a user database with user profiles stored in some way (e.g., MongoDB, SQL database, etc.)
// Here we'll create a dummy database object to simulate user data
const userDatabase = {
    users: [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
        { username: 'ogbuche.ogbuleke@sterling.ogulekeu', password: 'password3' },
        { username: 'hansel.azuka@sterling.ng', password: 'password4' },
        { username: 'daniel@bepeerless.co', password: 'password5' },
        { username: 'saheed.gbadamosi@sterling.ng', password: 'finopsuser1' },
        { username: 'saheed.adegoke@sterling.ng', password: 'finopsuser2' },

        // Add more user objects as needed
    ]
};

// Asynchronous function to authenticate user
async function authenticateUser(username, password) {
    // Simulating database query to find user
    const user = userDatabase.users.find(user => user.username === username);

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    if (user.password !== password) {
        return { success: false, message: 'Incorrect password' };
    }

    return { success: true, message: 'Login successful' };
}

// Example usage:
async function login(username, password) {
    try {
        const authenticationResult = await authenticateUser(username, password);
        console.log(authenticationResult.message);
        if (authenticationResult.success) {
            // Redirect to dashboard or perform further actions upon successful login
        } else {
            // Handle unsuccessful login
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        // Handle error
    }
}











////////////////////////////////////////////////////////////////////

// Newton's method for finding roots of a function



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
                [dbo].[LOANS.DEPOSIT]
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

//Function to calculate internal rate of return (IRR) as initial guess for XIRR
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







async function xirr(productId) {
    try {
        const rows = await queryData(productId);
        // Extract cash flows and dates
        const cashFlows = rows.map(row => row.CASH_FLOW_AMT);
        const dates = rows.map(row => row.DATE);

        //         // Assuming you have a rate variable available
        // Calculate the average rate using the cash flows and dates
        // const rate = calculateRate(cashFlows, dates);


        function calculateIRR(cashFlows, dates) {
            const cashflowsSum = cashFlows.reduce((sum, val) => sum + val, 0);
            const datesSum = dates.reduce((sum, val) => sum + val, 0);
            const averageCashflow = cashflowsSum / cashFlows.length;
            const averageDate = datesSum / dates.length;
            return averageCashflow / averageDate;
        }




        //         // Perform XIRR calculation using the retrieved data and calculated rate
        const cacheKey = productId + JSON.stringify(rows.map(row => row.DATE));
        if (xirrCache[cacheKey] !== undefined) {
            console.log("XIRR value found in cache:", xirrCache[cacheKey]);
            return xirrCache[cacheKey];
        }


        // Calculate XIRR using the cash flows and dates
        const initialGuess = calculateIRR(cashFlows, dates);
        console.log("Initial guess for XIRR:", initialGuess);
        const xirrValue = newton(rate => xnpv(rate, cashFlows, dates), initialGuess);
        console.log("Calculated XIRR:", xirrValue);


        // Store the calculated XIRR value in the cache
        xirrCache[cacheKey] = xirrValue;



        // Insert XIRR value into the database
        await insertXIRRIntoDatabase(productId, xirrValue);

        console.log("XIRR value for Product ID", productId, ":", xirrValue);
        console.log("Cash Flows:", cashFlows);
        console.log("Dates:", dates);
        // console.log("Rate:", rate);

        return { xirrValue, cashFlows, dates };
    } catch (e) {
        console.error("XIRR calculation error:", e);
        return NaN;
    }
}








const cache = require('memory-cache');



// Main function with caching logic
async function main(productId) {
    try {
        // Check productId is provided
        if (!productId) {
            throw new Error("Product ID is required");
        }

        // Check cache for XIRR value
        const cachedXIRR = cache.get(productId);
        if (cachedXIRR) {
            console.log("XIRR (from cache):", cachedXIRR.toFixed(4)); // Adjust precision as needed
            return;
        }

        // Ensure SQL Server connection
        await connectToSqlServer(config);

        // Query data from the database
        const rows = await queryData(productId);

        // Check if rows are empty
        if (!rows || rows.length === 0) {
            throw new Error("No data found for the provided product ID");
        }

        // Calculate XIRR for the retrieved data
        const xirrValue = xirr(rows, productId);

        // Check if xirrValue is valid
        if (isNaN(xirrValue)) {
            throw new Error("Invalid XIRR value calculated");
        }

        // Round the XIRR value to 4 decimal places
        const roundedXIRR = Math.round(xirrValue * 10000) / 10000; // Rounds to 4 decimal places

        // Cache XIRR value
        cache.put(productId, roundedXIRR);

        // Output the XIRR value
        console.log("XIRR:", roundedXIRR.toFixed(4)); // Adjust precision as needed

        // Insert XIRR into the database
        await insertXIRRIntoDatabase(productId, roundedXIRR);

        // Close the connection
        await sql.close();
    } catch (error) {
        console.error('Error:', error);
        // Log error
        if (error.message) {
            console.error('Error Message:', error.message);
        }
    }
}

// Call the main function with the product ID
const productId = 'your_product_id';
main(productId);



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




































module.exports = {
    calculateIRR: calculateIRR,
    xirr: xirr,
    main: main,
    // queryXIRRRate:queryXIRRRate,
    // calculateAndInsertXIRR:calculateAndInsertXIRR,
    connectToSqlServer: connectToSqlServer,
    authenticateUser: authenticateUser,
    getifrsprofitloss_withQuery: getifrsprofitloss_withQuery,
    computeXirrById: computeXirrById,
    // changePassword:changePassword,
    // fetchDataAndGenerateCSV:fetchDataAndGenerateCSV,
    // writeCSVToFile:writeCSVToFile,
    // searchProductByInput:searchProductByInput,
    computeXirrProductByInput: computeXirrProductByInput,
    computeXirrProduct: computeXirrProduct,
    computeXnpvProductByInput: computeXnpvProductByInput,
    computeXnpvProduct: computeXnpvProduct,
    fetchDataFromOthers: fetchDataFromOthers,
    fetchDataFromTerm: fetchDataFromTerm,
    fetchDataFromIfrsAssetLiab: fetchDataFromIfrsAssetLiab,
    fetchDataFromSummary: fetchDataFromSummary,
    fetchDataFromSpecial: fetchDataFromSpecial,
    // searchProduct:searchProduct,
    getProductDetailsById: getProductDetailsById,
    getProductById: getProductById,
    fetchDataFromHrm: fetchDataFromHrm,
    fetchDataFromSmall: fetchDataFromSmall,
    fetchDataFromCorporate: fetchDataFromCorporate,
    fetchDataFromRetail: fetchDataFromRetail,
    convertToCSV: convertToCSV,
    // getdata: getdata,
    // getdata_withQuery: getdata_withQuery,
    // getProductDetails:getProductDetails,
    getagricloan_withQuery: getagricloan_withQuery,
    getcorporateloan_withQuery: getcorporateloan_withQuery,
    gethrmloan_withQuery: gethrmloan_withQuery,
    getretailloan_withQuery: getretailloan_withQuery,
    getsmallbussloan_withQuery: getsmallbussloan_withQuery,
    getloandeposits_withQuery: getloandeposits_withQuery,
    getbaldata_withQuery: getbaldata_withQuery,
    getloandata_withQuery: getloandata_withQuery,
    // getgldata_withQuery: getgldata_withQuery,
    // connectToSqlServer: connectToSqlServer,
    // getProductDetails: getProductDetails,   
    fetchDataFromDatabase: fetchDataFromDatabase,
    runhrmstored_withQuery: runhrmstored_withQuery,
    runagricstored_withQuery: runagricstored_withQuery,
    runcorporatestored_withQuery: runcorporatestored_withQuery,
    runretailstored_withQuery: runretailstored_withQuery,
    runsmallstored_withQuery: runsmallstored_withQuery,
    // getagricProductDetails:getagricProductDetails,
    getloandata_withQuery: getloandata_withQuery,
    // calculateXIRR:calculateXIRR,
    // convertToCSVAndSend:convertToCSVAndSend,    
    // insertIntoIFRSAssetLiability:insertIntoIFRSAssetLiability,
    gettermdeposits_withQuery: gettermdeposits_withQuery,
    getspecialdeposits_withQuery: getspecialdeposits_withQuery,
    getotherdeposits_withQuery: getotherdeposits_withQuery,
    getifrsassetliab_withQuery: getifrsassetliab_withQuery,
    fetchDataFromIfrsProfitLoss: fetchDataFromIfrsProfitLoss,
    fetchDataFromSearch: fetchDataFromSearch,
    getxirr_rate_withQuery: getxirr_rate_withQuery,

    // newton:newton,
    // queryCashFlowsAndDates:queryCashFlowsAndDates,
    // writeCashFlowsToFile:writeCashFlowsToFile,
    // insertXIRRIntoDatabase:insertXIRRIntoDatabase,
    // jsDateToExcelSerialDate:jsDateToExcelSerialDate
    // dateToExcelSerialDate:dateToExcelSerialDate,
    //squeryCashFlowsAndDates:queryCashFlowsAndDates,
    // calculateXNPV:calculateXNPV,
    // queryXIRRRate:queryXIRRRate,
    //calculateXNPVUsingExcel:calculateXNPVUsingExcel,
    // getProductById:getProductById
    // getAgricLoanByProductId:getAgricLoanByProductId



    // excelSerialDateToJSDate:excelSerialDateToJSDate,
    // // calculateIRR:calculateIRR,

    // gettestagric_withQuery:gettestagric_withQuery,
    // insertIntoIFRSSummary:insertIntoIFRSSummary,
    // getAgricLoanData:getAgricLoanData
    // getAgricLoanDataHandler:getAgricLoanDataHandler



};