const express = require('express');

const router = express.Router();

const fs = require('fs');

const sql = require('mssql');

const path = require('path'); // Import the path module
 
const config = {

    user: 'your_username',

    password: 'your_password',

    server: 'your_server',

    database: 'your_database'

};
 
router.get('/getAgricLoanData', async (req, res) => {

    try {

        let pool = await sql.connect(config);

        let resSQL = await pool.request().query("SELECT * FROM [CBUReportDB].[dbo].[AGRICULTURAL.LOANS]");
 
        // Convert the recordsets to CSV format

        let csvData = '';

        if (resSQL.recordsets.length > 0 && resSQL.recordsets[0].length > 0) {

            const headers = Object.keys(resSQL.recordsets[0][0]).join(',');

            const rows = resSQL.recordsets[0].map(row => Object.values(row).join(',')).join('\n');

            csvData = `${headers}\n${rows}`;

        }
 
        // Write the CSV data to a file

        fs.writeFile('agricultural_loans.csv', csvData, (err) => {

            if (err) throw err;

            console.log('CSV file saved.');

        });
 
        // Convert the recordsets to JSON format

        let jsonData = JSON.stringify(resSQL.recordsets);
 
        // Write JSON data to a file wrapped in <pre> tags

        fs.writeFile('public/newfile.html', `<pre>${jsonData}</pre>`, (err) => {

            if (err) throw err;

            console.log('HTML file saved.');

        });
 
        // Convert the recordsets to HTML table format

        let htmlTable = '<table border="1">';

        if (resSQL.recordsets.length > 0 && resSQL.recordsets[0].length > 0) {

            // Add table headers

            htmlTable += '<tr>';

            for (let key in resSQL.recordsets[0][0]) {

                htmlTable += `<th>${key}</th>`;

            }

            htmlTable += '</tr>';

            // Add table rows

            resSQL.recordsets[0].forEach(row => {

                htmlTable += '<tr>';

                for (let key in row) {

                    htmlTable += `<td>${row[key]}</td>`;

                }

                htmlTable += '</tr>';

            });

        }

        htmlTable += '</table>';
 
        // Render the index.ejs template and pass the htmlTable data to it

        res.render('index', { htmlTable });
 
    } catch (error) {

        console.log("mathus-error :" + error);

        res.status(500).send('Error occurred while fetching data.'); // Sending error response

    }

});
 
module.exports = router;
