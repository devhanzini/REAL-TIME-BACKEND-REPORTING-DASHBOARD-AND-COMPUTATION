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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// async function getdata() {

//     try {
//         let pool = await sql.connect(config);
//         console.log("sql server connected...");
//     } catch (error) {
//         console.log("mathus-error :" + error);

//     }
// };





// async function getdata_withQuery(){
//     try {
//         let pool = await sql.connect(config);
//         let res = await pool.request().query("SELECT * FROM haaa10");
//          return res.recordsets;
//     }    
//     catch (error) {
//     console.log("mathus-error :" + error);

//     }};


async function getretailloan_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[SMALL.LOANS] WHERE PRODUCT_ID = `{$PRODUCT_ID}`");
         return res.recordsets;
    }    
    catch (error) {
    console.log("mathus-error :" + error);

    }};


// async function gettestagric_withQuery(){
//     try {
//         let pool = await sql.connect(config);
//         const result = await sql.query('SELECT * FROM [CBUReportDB].[dbo].[AGRICULTURAL.LOANS]');
//         return res.recordsets;
//     }    
//     catch (error) {
//     console.log("mathus-error :" + error);

//     }};

// Make an AJAX request to fetch data from the PHP script
// fetch('/views/index.php')
//   .then(response => response.json()) // Assuming PHP script outputs JSON
//   .then(data => {
//     // Handle the fetched data
//     console.log(data);
//   })
//   .catch(error => {
//     console.error('Error fetching data:', error);
//   });

// async function fetchDataFromMSSQL() {
//     try {
//       // Connect to MSSQL
//       await sql.connect(config);

//       // Execute a query to fetch data
//       const result = await sql.query('SELECT * FROM [CBUReportDB].[dbo].[AGRICULTURAL.LOANS]');

//       // Close the MSSQL connection
//     //   await sql.close();

//       // Return the fetched data
//       return result.recordset;
//     } catch (error) {
//       console.error('Error fetching data from MSSQL', error);
//       throw error;
//     }
//   }


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
/////////////////////////////////////////////////////////////////////////////////////////////////////

// const { ConnectionPool } = require('mssql');


// // const pool = new ConnectionPool(config);
// // Function to get small business loans with pagination and total count
// async function getsmallbussloan_withQuery(offset, pageSize) {
//     try {
//         // Connect to the database
//         let pool = await sql.connect(config);
//         // Create a new request from the pool
//         const request = pool.request();

//         // Parameterized query for the main data retrieval
//         const query = `
//             SELECT *, 'View' AS Action
//             FROM [CBUReportDB].[dbo].[SMALL.BUSS.LOANS]
//             ORDER BY PRODUCT_ID
//             OFFSET @offset ROWS
//             FETCH NEXT @pageSize ROWS ONLY
//         `;
//         const result = await request.input('offset', sql.Int, offset)
//                                       .input('pageSize', sql.Int, pageSize)
//                                       .query(query);
        
//         // Query for getting total count
//         const countQuery = 'SELECT COUNT(*) AS totalCount FROM [CBUReportDB].[dbo].[SMALL.BUSS.LOANS]';
//         const countResult = await request.query(countQuery);
//         const totalCount = countResult.recordset[0].totalCount;

//         return { data: result.recordset, totalCount };
//     } catch (error) {
//         // Add more specific error handling/logging if needed
//         throw error;
//     }
// }


// async function getagricloan_withQuery(offset, pageSize) {
//     try {
//         const pool = new ConnectionPool(config);
//         await pool.connect();

//         const request = pool.request();
//         const result = await request.query(`SELECT * , 'View' AS Action FROM [CBUReportDB].[dbo].[AGRICULTURAL.LOANS] ORDER BY PRODUCT_ID OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`);
//         const countResult = await request.query('SELECT COUNT(*) AS totalCount FROM [CBUReportDB].[dbo].[AGRICULTURAL.LOANS]');
//         const totalCount = countResult.recordset[0].totalCount;

//         // Release the connection
//         await pool.close();

//         return { data: result.recordset, totalCount };
//     } catch (error) {
//         throw error;
//     }
// }




// async function gethrmloan_withQuery(offset, pageSize) {
//     try {
//         const pool = new ConnectionPool(config);
//         await pool.connect();

//         const request = pool.request();
//         const result = await request.query(`SELECT * , 'View' AS Action FROM [CBUReportDB].[dbo].[HRM.LOANS] ORDER BY PRODUCT_ID OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`);
//         const countResult = await request.query('SELECT COUNT(*) AS totalCount FROM [CBUReportDB].[dbo].[HRM.LOANS]');
//         const totalCount = countResult.recordset[0].totalCount;

//         // Release the connection
//         await pool.close();

//         return { data: result.recordset, totalCount };
//     } catch (error) {
//         throw error;
//     }
// }



// async function getretailloan_withQuery(offset, pageSize) {
//     try {
//         const pool = new ConnectionPool(config);
//         await pool.connect();

//         const request = pool.request();
//         const result = await request.query(`SELECT * , 'View' AS Action FROM [CBUReportDB].[dbo].[RETAIL.LOANS] ORDER BY PRODUCT_ID OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`);
//         const countResult = await request.query('SELECT COUNT(*) AS totalCount FROM [CBUReportDB].[dbo].[RETAIL.LOANS]');
//         const totalCount = countResult.recordset[0].totalCount;

//         // Release the connection
//         await pool.close();

//         return { data: result.recordset, totalCount };
//     } catch (error) {
//         throw error;
//     }
// }


// async function getcorporateloan_withQuery(offset, pageSize) {
//     try {
//         const pool = new ConnectionPool(config);
//         await pool.connect();

//         const request = pool.request();
//         const result = await request.query(`SELECT * , 'View' AS Action FROM [CBUReportDB].[dbo].[CORPORATE.LOANS] ORDER BY PRODUCT_ID OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`);
//         const countResult = await request.query('SELECT COUNT(*) AS totalCount FROM [CBUReportDB].[dbo].[CORPORATE.LOANS]');
//         const totalCount = countResult.recordset[0].totalCount;

//         // Release the connection
//         await pool.close();

//         return { data: result.recordset, totalCount };
//     } catch (error) {
//         throw error;
//     }
// }







// async function gettermdeposits_withQuery(offset, pageSize) {
//     try {
//         const pool = new ConnectionPool(config);
//         await pool.connect();

//         const request = pool.request();
//         const result = await request.query(`SELECT * , 'View' AS Action FROM [CBUReportDB].[dbo].[TERM.DEPOSITS] ORDER BY PRODUCT_ID OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`);
//         const countResult = await request.query('SELECT COUNT(*) AS totalCount FROM [CBUReportDB].[dbo].[TERM.DEPOSITS]');
//         const totalCount = countResult.recordset[0].totalCount;

//         // Release the connection
//         await pool.close();

//         return { data: result.recordset, totalCount };
//     } catch (error) {
//         throw error;
//     }
// }









// async function getspecialdeposits_withQuery(offset, pageSize) {
//     try {
//         const pool = new ConnectionPool(config);
//         await pool.connect();

//         const request = pool.request();
//         const result = await request.query(`SELECT * , 'View' AS Action FROM [CBUReportDB].[dbo].[SPECILIZED.DEPOSITS] ORDER BY PRODUCT_ID OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`);
//         const countResult = await request.query('SELECT COUNT(*) AS totalCount FROM [CBUReportDB].[dbo].[SPECILIZED.DEPOSITS]');
//         const totalCount = countResult.recordset[0].totalCount;

//         // Release the connection
//         await pool.close();

//         return { data: result.recordset, totalCount };
//     } catch (error) {
//         throw error;
//     }
// }










// async function getotherdeposits_withQuery(offset, pageSize) {
//     try {
//         const pool = new ConnectionPool(config);
//         await pool.connect();

//         const request = pool.request();
//         const result = await request.query(`SELECT * , 'View' AS Action FROM [CBUReportDB].[dbo].[TERM.DEPOSITS.STR.OTHERS] ORDER BY PRODUCT_ID OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`);
//         const countResult = await request.query('SELECT COUNT(*) AS totalCount FROM [CBUReportDB].[dbo].[TERM.DEPOSITS.STR.OTHERS]');
//         const totalCount = countResult.recordset[0].totalCount;

//         // Release the connection
//         await pool.close();

//         return { data: result.recordset, totalCount };
//     } catch (error) {
//         throw error;
//     }
// }







// async function getifrsassetliab_withQuery(offset, pageSize) {
//     try {
//         const pool = new ConnectionPool(config);
//         await pool.connect();

//         const request = pool.request();
//         const result = await request.query(`SELECT * , 'View' AS Action FROM [CBUReportDB].[dbo].[IFRS_ASST_LIAB] `);
//         const countResult = await request.query('SELECT COUNT(*) AS totalCount FROM [CBUReportDB].[dbo].[IFRS_ASST_LIAB]');
//         const totalCount = countResult.recordset[0].totalCount;

//         // Release the connection
//         await pool.close();

//         return { data: result.recordset, totalCount };
//     } catch (error) {
//         throw error;
//     }
// }






// // async function getretailloan_withQuery(offset, pageSize) {
// //     try {
// //         const request = pool.request();
// //         const result = await request.query(`SELECT *, 'View' AS Action FROM [CBUReportDB].[dbo].[RETAIL.LOANS] ORDER BY PRODUCT_ID OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`);
// //         const countResult = await request.query('SELECT COUNT(*) AS totalCount FROM [CBUReportDB].[dbo].[RETAIL.LOANS]');
// //         const totalCount = countResult.recordset[0].totalCount;

// //         return { data: result.recordset, totalCount };
// //     } catch (error) {
// //         throw error;
// //     }
// // }

// async function getProductDetails(productId) {
//     try {
//         console.log('Fetching product details for productId:', productId);
//         const request = pool.request();
//         const result = await request.input('productId', productId).query(`SELECT * FROM [CBUReportDB].[dbo].[SMALL.BUSS.LOANS] WHERE PRODUCT_ID = @productId`);
//         console.log('Product details:', result.recordset);
//         return result.recordset[0];
//     } catch (error) {
//         console.error('Error fetching product details:', error);
//         throw error;
//     }
// }

// async function getagricProductDetails(productId) {
//     try {
//         console.log('Fetching product details for productId:', productId);
//         const request = pool.request();
//         const result = await request.input('productId', productId).query(`SELECT * FROM [CBUReportDB].[dbo].[AGRICULTURAL.LOANS] WHERE PRODUCT_ID = @productId`);
//         console.log('Product details:', result.recordset);
//         return result.recordset[0];
//     } catch (error) {
//         console.error('Error fetching product details:', error);
//         throw error;
//     }
// }





// // async function getloandata_withQuery(productId) {
// //     try {
// //         console.log('Fetching product details for productId:', productId);
// //         const request = pool.request();
// //         const result = await request.input('productId', productId).query(`SELECT * FROM [CBUReportDB].[dbo].[IFRS_SUMMARY.LOANS] WHERE PRODUCT_ID = @productId`);
// //         console.log('Product details:', result.recordset);
// //         return result.recordset[0];
// //     } catch (error) {
// //         console.error('Error fetching product details:', error);
// //         throw error;
// //     }
// // }






// async function getloandata_withQuery(offset, pageSize) {
//     try {
//         const pool = new ConnectionPool(config);
//         await pool.connect();

//         const request = pool.request();
//         const result = await request.query(`SELECT * , 'View' AS Action FROM [CBUReportDB].[dbo].[IFRS_SUMMARY] ORDER BY HEADER OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`);
//         const countResult = await request.query('SELECT COUNT(*) AS totalCount FROM [CBUReportDB].[dbo].[IFRS_SUMMARY]');
//         const totalCount = countResult.recordset[0].totalCount;

//         // Release the connection
//         await pool.close();

//         return { data: result.recordset, totalCount };
//     } catch (error) {
//         throw error;
//     }
// }



// // async function getcorporateProductDetails(productId) {
// //     try {
// //         console.log('Fetching product details for productId:', productId);
// //         const request = pool.request();
// //         const result = await request.input('productId', productId).query(`SELECT * FROM [CBUReportDB].[dbo].[CORPORATE.LOANS] WHERE PRODUCT_ID = @productId`);
// //         console.log('Product details:', result.recordset);
// //         return result.recordset[0];
// //     } catch (error) {
// //         console.error('Error fetching product details:', error);
// //         throw error;
// //     }
// // }






// // async function gethrmProductDetails(productId) {
// //     try {
// //         console.log('Fetching product details for productId:', productId);
// //         const request = pool.request();
// //         const result = await request.input('productId', productId).query(`SELECT * FROM [CBUReportDB].[dbo].[HRM.LOANS] WHERE PRODUCT_ID = @productId`);
// //         console.log('Product details:', result.recordset);
// //         return result.recordset[0];
// //     } catch (error) {
// //         console.error('Error fetching product details:', error);
// //         throw error;
// //     }
// // }






// // async function getretailProductDetails(productId) {
// //     try {
// //         console.log('Fetching product details for productId:', productId);
// //         const request = pool.request();
// //         const result = await request.input('productId', productId).query(`SELECT * FROM [CBUReportDB].[dbo].[RETAIL.LOANS] WHERE PRODUCT_ID = @productId`);
// //         console.log('Product details:', result.recordset);
// //         return result.recordset[0];
// //     } catch (error) {
// //         console.error('Error fetching product details:', error);
// //         throw error;
// //     }
// // }
// /////////////////////////////////////////////////////////////////////////////////////////////////////










// // async function getretailloan_withQuery() {
// //     try {
// //         let pool = await sql.connect(config);
// //         let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[RETAIL.LOANS]");
// //         return res.recordsets;
// //     } catch (error) {
// //         console.log("mathus-error :" + error);

// //     }
// // };




// //   async function getProductDetails(productId) {
// //     try {
// //       const request = pool.request();
// //       const result = await request.input('productId', productId).query(`SELECT * FROM [CBUReportDB].[dbo].[SMALL.BUSS.LOANS] WHERE PRODUCT_ID = @productId`);
// //       return result.recordset[0]; // Assuming there's only one product with the given productId
// //     } catch (error) {
// //       throw error;
// //     }}




// //   async function getProductById(productId) {
// //     try {
// //       const request = pool.request();
// //       const result = await request.query(`SELECT * FROM [CBUReportDB].[dbo].[SMALL.BUSS.LOANS] WHERE product_id = '${productId}'`);
// //       return result.recordset[0];
// //     } catch (error) {
// //       throw error;
// //     }
// //   }
// // ////////////////////////////////////////////////////////////////////////////////






// // async function getsmallbussloan_withQuery(){
// //     try {
// //         let pool = await sql.connect(config);
// //         let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[SMALL.BUSS.LOANS]");
// //          return res.recordsets[0];
// // }    
// //     catch (error) {
// //     console.log("mathus-error :" + error);

// //     }};




// // async function getAgricLoanData() {
// //     try {
// //         let pool = await sql.connect(config);
// //         let res = await pool.request().query("SELECT * FROM [CBUReportDB].[dbo].[AGRICULTURAL.LOANS]");

// //         // Convert the recordsets to CSV format
// //         let csvData = '';
// //         if (res.recordsets.length > 0 && res.recordsets[0].length > 0) {
// //             const headers = Object.keys(res.recordsets[0][0]).join(',');
// //             const rows = res.recordsets[0].map(row => Object.values(row).join(',')).join('\n');
// //             csvData = `${headers}\n${rows}`;
// //         }

// //         // Write the CSV data to a file
// //         fs.writeFile('agricultural_loans.csv', csvData, (err) => {
// //             if (err) throw err;
// //             console.log('CSV file saved.');
// //         });

// //         // Convert the recordsets to JSON format
// //         let jsonData = JSON.stringify(res.recordsets);

// //         // Write JSON data to a file wrapped in <pre> tags
// //         fs.writeFile('newfile.html', `<pre>${jsonData}</pre>`, (err) => {
// //             if (err) throw err;
// //             console.log('HTML file saved.');
// //         });

// //         // Generate HTML table to display data in frontend
// //         let htmlTable = '<table border="1">';
// //         if (res.recordsets.length > 0 && res.recordsets[0].length > 0) {
// //             // Add table headers
// //             htmlTable += '<tr>';
// //             for (let key in res.recordsets[0][0]) {
// //                 htmlTable += `<th>${key}</th>`;
// //             }
// //             htmlTable += '</tr>';
// //             // Add table rows
// //             res.recordsets[0].forEach(row => {
// //                 htmlTable += '<tr>';
// //                 for (let key in row) {
// //                     htmlTable += `<td>${row[key]}</td>`;
// //                 }
// //                 htmlTable += '</tr>';
// //             });
// //         }
// //         htmlTable += '</table>';

// //         return htmlTable;
// //     } catch (error) {
// //         console.log("mathus-error :" + error);
// //         return null;
// //     }
// // }

// // // Call the function
// // getAgricLoanData()
// //     .then(htmlTable => {
// //         // Use htmlTable variable to display the table in your frontend
// //         console.log(htmlTable);
// //     })
// //     .catch(err => console.error(err));




// // Render the index.ejs template and pass the htmlTable data to it



// //   // Define the route handler for '/getAgricLoanData'
// //   const getAgricLoanDataHandler = async (req, res, next) => {
// //     await getAgricLoanData(req, res, next); // Call the middleware function
// //   };

// //   // Attach the route handler to the router
// //   router.get('/getAgricLoanData', getAgricLoanDataHandler);

// //   // Define the route handler for '/downloadCSV'
// //   router.get('/downloadCSV', (req, res) => {
// //     const filePath = path.join(__dirname, 'agricultural_loans.csv');
// //     res.download(filePath, 'agricultural_loans.csv');
// //   });



































// // async function getsmallbussloan_withQuery(){
// //     try {
// //         let pool = await sql.connect(config);
// //         let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[SMALL.BUSS.LOANS]");
// //          return res.recordsets;
// //     // const data = await res.json();
// //     // const data = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[SMALL.BUSS.LOANS]");
// //     // res.value = data.info; 
// //     // return data.info;
// // }    
// //     catch (error) {
// //     console.log("mathus-error :" + error);

// //     }};








// // document.addEventListener('DOMContentLoaded', async function() {

// // const tableContainer = document.getElementById('table-container');

// // // Function to render the data into an HTML table
// // await function renderTable(data) {
// //     // Create a table element
// //     const table = document.createElement('table');
// //     table.classList.add('my-table-class'); // You can add your own class for styling

// //     // Create table header row
// //     const headerRow = table.insertRow();
// //     for (const key in data[0]) {
// //         if (data[0].hasOwnProperty(key)) {
// //             const headerCell = document.createElement('th');
// //             headerCell.textContent = key;
// //             headerRow.appendChild(headerCell);
// //         }
// //     }

// //     // Create table rows and cells
// //     data.forEach(item => {
// //         const row = table.insertRow();
// //         for (const key in item) {
// //             if (item.hasOwnProperty(key)) {
// //                 const cell = row.insertCell();
// //                 cell.textContent = item[key];
// //             }
// //         }
// //     });

// //     // Append the table to the container
// //     tableContainer.appendChild(table);
// // }

// //     // Your code here
// // });






















// // async function getagricloan_withQuery() {
// //     try {
// //         let pool = await sql.connect(config);
// //         let res = await pool.request().query("SELECT * FROM [CBUReportDB].[dbo].[AGRICULTURAL.LOANS]");

// //         // Convert the recordsets to CSV format
// //         let csvData = '';
// //         if (res.recordsets.length > 0 && res.recordsets[0].length > 0) {
// //             const headers = Object.keys(res.recordsets[0][0]).join(',');
// //             const rows = res.recordsets[0].map(row => Object.values(row).join(',')).join('\n');
// //             csvData = `${headers}\n${rows}`;
// //         }

// //         // Write the CSV data to a file
// //         fs.writeFile('agricultural_loans.csv', csvData, (err) => {
// //             if (err) throw err;
// //             console.log('CSV file saved.');
// //         });

// //         // Convert the recordsets to JSON format
// //         let jsonData = JSON.stringify(res.recordsets);

// //         // Write JSON data to a file wrapped in <pre> tags
// //         fs.writeFile('views/newfile.html', `<pre>${jsonData}</pre>`, (err) => {
// //             if (err) throw err;
// //             console.log('HTML file saved.');
// //         });

// //         // Generate HTML table to display data in frontend
// //         let htmlTable = '<table border="1">';
// //         if (res.recordsets.length > 0 && res.recordsets[0].length > 0) {
// //             // Add table headers
// //             htmlTable += '<tr>';
// //             for (let key in res.recordsets[0][0]) {
// //                 htmlTable += `<th>${key}</th>`;
// //             }
// //             htmlTable += '</tr>';
// //             // Add table rows
// //             res.recordsets[0].forEach(row => {
// //                 htmlTable += '<tr>';
// //                 for (let key in row) {
// //                     htmlTable += `<td>${row[key]}</td>`;
// //                 }
// //                 htmlTable += '</tr>';
// //             });
// //         }
// //         htmlTable += '</table>';

// //         return htmlTable;
// //     } catch (error) {
// //         console.log("mathus-error :" + error);
// //         return null;
// //     }
// // }

// // // Call the function
// // getagricloan_withQuery()
// //     .then(htmlTable => {
// //         // Use htmlTable variable to display the table in your frontend
// //         console.log(htmlTable);
// //     })
// //     .catch(err => console.error(err));








// // app.use(express.static('public'));

// // async function getagricloan_withQuery() {
// //     try {
// //         let pool = await sql.connect(config);
// //         let res = await pool.request().query("SELECT * FROM [CBUReportDB].[dbo].[AGRICULTURAL.LOANS]");

// //         // Convert the recordsets to CSV format
// //         let csvData = '';
// //         if (res.recordsets.length > 0 && res.recordsets[0].length > 0) {
// //             const headers = Object.keys(res.recordsets[0][0]).join(',');
// //             const rows = res.recordsets[0].map(row => Object.values(row).join(',')).join('\n');
// //             csvData = `${headers}\n${rows}`;
// //         }

// //         // Write the CSV data to a file
// //         fs.writeFile('agricultural_loans.csv', csvData, (err) => {
// //             if (err) throw err;
// //             console.log('CSV file saved.');
// //         });

// //         // Convert the recordsets to JSON format
// //         let jsonData = JSON.stringify(res.recordsets);

// //         // Write JSON data to a file wrapped in <pre> tags
// //         fs.writeFile('public/newfile.html', `<pre>${jsonData}</pre>`, (err) => {
// //             if (err) throw err;
// //             console.log('HTML file saved.');
// //         });

// //         return 'newfile.html'; // Return the filename


// //     } catch (error) {
// //         console.log("mathus-error :" + error);
// //         return null;
// //     }
// // }

// // // Call the function
// // getagricloan_withQuery()
// //     .then(newfile => {
// //         if (newfile.html) {
// //             console.log(`HTML file saved as ${newfile.html}`);
// //         } else {
// //             console.log('Failed to save HTML file.');
// //         }
// //     })
// //     .catch(err => console.error(err));










// ////////////////////////////////////////////////////////////////////
// // Newton's method for finding roots
// function newton(func, guess) {
//     const EPSILON = 1e-10;
//     const MAX_ITERATIONS = 1000;
//     let x0 = guess;
//     let x1;
//     let f0, f1;
//     let iterations = 0;
//     do {
//         f0 = func(x0);
//         f1 = derivative(func, x0);
//         if (f1 === 0) {
//             throw new Error("Derivative is zero.");
//         }
//         x1 = x0 - f0 / f1;
//         if (++iterations > MAX_ITERATIONS) {
//             throw new Error("Maximum iterations reached.");
//         }
//         x0 = x1;
//     } while (Math.abs(x1 - x0) > EPSILON);
//     return x1;
// }

// // Derivative calculation for Newton's method
// function derivative(func, x) {
//     const h = 1e-5;
//     return (func(x + h) - func(x)) / h;
// }

// // Calculate Net Present Value (NPV)
// function xnpv(rate, values, dates) {
//     let sum = 0;
//     for (let i = 0; i < values.length; i++) {
//         sum += values[i] / Math.pow(1 + rate, (dates[i] - dates[0]) / 365);
//     }
//     return sum;
// }

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

// const productId = 'AA240110R854'; // Sample product ID

// // Function to query data from the database
// async function queryData(productId) {
//     try {
//         const result = await sql.query `
//             SELECT DATE, CASH_FLOW_AMT
//             FROM [dbo].[HRM.LOANS]
//             WHERE PRODUCT_ID = ${productId}
//             GROUP BY DATE, CASH_FLOW_AMT
//             ORDER BY DATE
//         `;
//         // Convert JavaScript dates to Excel serial dates
//         const rows = result.recordset.map(row => ({
//             CASH_FLOW_AMT: row.CASH_FLOW_AMT,
//             DATE: jsDateToExcelSerialDate(new Date(row.DATE))
//         }));
//         // Print extracted dates and cash flows
//         console.log("Extracted Dates and Cash Flows:");
//         rows.forEach(row => {
//             console.log("Date:", row.DATE, "Cash Flow:", row.CASH_FLOW_AMT);
//         });
//         return rows;
//     } catch (error) {
//         console.error("Error querying data:", error);
//         throw error;
//     }
// }

// // Function to calculate internal rate of return (IRR) as initial guess for XIRR
// function calculateIRR(values, dates) {
//     // Use a library or an existing implementation to calculate IRR
//     // For simplicity, let's assume a fixed initial guess for now
//     return 0.1; // You can replace this with a more accurate estimate
// }

// // XIRR calculation
// function xirr(rows) {
//     try {
//         // Extract cash flows and dates from rows
//         const cashFlows = rows.map(row => row.CASH_FLOW_AMT);
//         const dates = rows.map(row => row.DATE);

//         // Calculate XIRR using the cash flows and dates
//         const initialGuess = calculateIRR(cashFlows, dates);
//         console.log("Initial guess for XIRR:", initialGuess);
//         const xirrValue = newton(rate => xnpv(rate, cashFlows, dates), initialGuess);
//         console.log("Calculated XIRR:", xirrValue);
//         return xirrValue;
//     } catch (e) {
//         console.error("XIRR calculation error:", e);
//         return NaN;
//     }
// }


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


// // Function to convert JavaScript Date object to Excel serial date
// function jsDateToExcelSerialDate(date) {
//     const excelStartDate = new Date('1899-12-30');
//     const millisecondsInDay = 24 * 60 * 60 * 1000;
//     const daysSinceStart = Math.floor((date - excelStartDate) / millisecondsInDay);
//     const fractionOfDay = date.getHours() / 24 + date.getMinutes() / (24 * 60) + date.getSeconds() / (24 * 60 * 60);
//     const excelSerialDate = daysSinceStart + fractionOfDay;
//     return excelSerialDate;
// }

// // Function to convert Excel serial date to JavaScript Date object
// function excelSerialDateToJSDate(serialDate) {
//     const excelStartDate = new Date('1899-12-30');
//     const millisecondsInDay = 24 * 60 * 60 * 1000;
//     const days = Math.floor(serialDate);
//     const fraction = serialDate - days;
//     const millisecondsSinceStart = (days - 1) * millisecondsInDay + fraction * millisecondsInDay;
//     return new Date(excelStartDate.getTime() + millisecondsSinceStart);
// }

// // Main function
// async function main() {
//     try {
//         // Connect to SQL Server
//         await connectToSqlServer(config);
//         // Query data from the database
//         const rows = await queryData(productId);

//         // Calculate XIRR for the retrieved data
//         const xirrValue = xirr(rows);
//         // Output the XIRR value
//         console.log("XIRR:", xirrValue.toFixed(10)); // Adjust precision as needed
//         // Calculate XNPV for the retrieved data
//         const xnpvValue = xnpvCalculation(rows, xirrValue);
//         // Output the XNPV value
//         console.log("XNPV:", xnpvValue.toFixed(2)); // Adjust precision as needed
//         // Close the connection
//         await sql.close();
//     } catch (error) {
//         console.error('Error:', error);
//     }


// }



// // Function to insert data into [dbo].[IFRS_SUMMARY]
// // Function to insert data into [CBUReportDB].[dbo].[IFRS_ASST_LIAB] for specific columns
// async function insertIntoIFRSAssetLiability(xirrRate, lastCalcAmt) {
//     try {
//         await sql.connect(config);
//         await sql.query`
//             INSERT INTO [CBUReportDB].[dbo].[IFRS_ASST_LIAB] (
//                 [XIRR_RATE],
//                 [LAST_CALC_AMT]
//             )
//             VALUES (
//                 ${xirrRate},
//                 ${lastCalcAmt}
//             );
//         `;
//         console.log("Inserted XIRR_RATE and LAST_CALC_AMT into [CBUReportDB].[dbo].[IFRS_ASST_LIAB] table.");
//     } catch (error) {
//         console.error("Error inserting data:", error);
//         throw error;
//     } finally {
//         await sql.close();
//     }
// }


// // Main function
// async function main() {
//     try {
//         // Connect to SQL Server
//         await sql.connect(config);
//         console.log("Connected to SQL Server");

//         // Query data from the database
//         const rows = await queryData(productId);

//         // Calculate XIRR for the retrieved data
//         const xirrValue = xirr(rows);
//         console.log("XIRR:", xirrValue.toFixed(10)); // Adjust precision as needed

//         // Calculate XNPV for the retrieved data
//         const xnpvValue = xnpvCalculation(rows, xirrValue);
//         console.log("XNPV:", xnpvValue.toFixed(2)); // Adjust precision as needed

//         // Insert XIRR and XNPV values into [dbo].[IFRS_SUMMARY] table
//         await insertIntoIFRSAssetLiability(xirrValue, xnpvValue);
//     } catch (error) {
//         console.error('Error:', error);
//     } finally {
//         await sql.close();
//     }
// }

// // Call the main function
// main();






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
    // getdata: getdata,
    // getdata_withQuery: getdata_withQuery,
    getagricloan_withQuery: getagricloan_withQuery,
    getcorporateloan_withQuery: getcorporateloan_withQuery,
    gethrmloan_withQuery: gethrmloan_withQuery,
    getretailloan_withQuery: getretailloan_withQuery,
    // getsmallbussloan_withQuery: getsmallbussloan_withQuery,
    // getloandeposits_withQuery: getloandeposits_withQuery,
    // getbaldata_withQuery: getbaldata_withQuery,
    // getloandata_withQuery: getloandata_withQuery,
    // getgldata_withQuery: getgldata_withQuery,
    //connectToSqlServer: connectToSqlServer,
    // getProductDetails: getProductDetails,
    runhrmstored_withQuery: runhrmstored_withQuery,
    runagricstored_withQuery: runagricstored_withQuery,
    runcorporatestored_withQuery: runcorporatestored_withQuery,
    runretailstored_withQuery: runretailstored_withQuery,
    runsmallstored_withQuery: runsmallstored_withQuery,
    // getagricProductDetails:getagricProductDetails,
    // getloandata_withQuery:getloandata_withQuery,
    // insertIntoIFRSAssetLiability:insertIntoIFRSAssetLiability,
    // gettermdeposits_withQuery:gettermdeposits_withQuery,
    // getspecialdeposits_withQuery:getspecialdeposits_withQuery,
    // getotherdeposits_withQuery:getotherdeposits_withQuery,
    // getifrsassetliab_withQuery:getifrsassetliab_withQuery

    // gettestagric_withQuery:gettestagric_withQuery,
    // insertIntoIFRSSummary:insertIntoIFRSSummary,
    // getAgricLoanData:getAgricLoanData
    // getAgricLoanDataHandler:getAgricLoanDataHandler



};



// module.exports = router;