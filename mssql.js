const express = require('express');
const sql = require('mssql');
const app = express();
const PORT = process.env.PORT || 3000;
 
// MSSQL configuration
const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'your_database',
};
 
// Create an async function to fetch data from MSSQL
async function fetchDataFromMSSQL() {
  try {
    // Connect to MSSQL
    await sql.connect(config);
 
    // Execute a query to fetch data
    const result = await sql.query('SELECT * FROM YourTable');
 
    // Close the MSSQL connection
    await sql.close();
 
    // Return the fetched data
    return result.recordset;
  } catch (error) {
    console.error('Error fetching data from MSSQL', error);
    throw error;
  }
}
 
// Define a route handler using router.get
app.get('/data', async (req, res) => {
  try {
    // Fetch data from MSSQL
    const data = await fetchDataFromMSSQL();
 
    // Render fetched data in HTML
    let html = '<h1>Data from MSSQL</h1>';
    html += '<ul>';
    data.forEach(row => {
      html += `<li>${row.columnName}</li>`; // Replace 'columnName' with actual column name
    });
    html += '</ul>';
 
    // Send the HTML response
    res.send(html);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
 
