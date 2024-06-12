
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

        const result = await sql.query`

            SELECT DATES, CASH_FLOW_AMT

            FROM [dbo].[HRM.LOANS]

            WHERE PRODUCT_ID = ${productId}

        `;

        return result.recordset;

    } catch (error) {

        console.error("Error querying data:", error);

        throw error;

    }

}
 
// Function to calculate XIRR with different initial guesses

function calculateXirrWithGuesses(values, dates, guesses) {

    let xirrValue = NaN;
 
    for (const guess of guesses) {

        try {

            xirrValue = xirr(values, dates, guess);

            if (!isNaN(xirrValue)) {

                break; // Break loop if valid XIRR is found

            }

        } catch (e) {

            console.error("XIRR calculation error:", e);

        }

    }
 
    return xirrValue;

}
 
// Function to print debug information

function printDebugInfo(values, dates) {

    console.log("Values:", values);

    console.log("Dates:", dates);

}
 
// Specify the product ID for which data is to be fetched

const productId = 'AA240110R854'; // Sample product ID
 
(async () => {

    try {
        // Connect to SQL Server

        await connectToSqlServer(config);
 
        // Query data from the database

        const rows = await queryData(productId);
 
        // Extract values and dates from the queried data

        const values = rows.map(row => row.CASH_FLOW_AMT);

        const dates = rows.map(row => new Date(row.DATES).getTime());
 
        // Print debug information

        printDebugInfo(values, dates);
 
        // Calculate XIRR with different initial guesses

        const initialGuesses = [0.1, 0.2, -0.1, -0.2]; // Try different initial guesses

        const xirrValue = calculateXirrWithGuesses(values, dates, initialGuesses);

        console.log("XIRR:", xirrValue);
 
        // Close the connection

        await sql.close();

    } catch (error) {

        console.error('Error:', error);

    }

})();
