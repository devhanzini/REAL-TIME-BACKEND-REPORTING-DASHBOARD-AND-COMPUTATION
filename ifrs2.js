var config = require ("./dbconfig");
const sql = require ("mssql/msnodesqlv8");




async function getsmallbussloan_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM  [CBUReportDB].[dbo].[SMALL.BUSS.LOANS]");
         return res.recordsets;
    }    
    catch (error) {
    console.log("mathus-error :" + error);
    
    }};






    
// Define the XNPV function
async function xnpv(rate, values, dates) {
    const dateDiffs = await dates.map(date => (date - dates[0]) / 365.0);
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i] / Math.pow(1 + rate, dateDiffs[i]);
    }
    return sum;
}

// Define the XIRR function
async function xirr(values, dates, guess) {
    try {
        const xirrValue =  await newton(rate =>  xnpv(rate, values, dates), guess);
        return xirrValue;
    } catch (e) {
        console.error(e);
        return NaN;
    }
}

// Newton's method implementation
function newton(func, guess) {
    let x0 = guess;
    let x1;
    let f0;
    let f1;
    const EPSILON = 1e-10;
    const MAX_ITERATIONS = 1000;
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

// Fetch data from the database
const query = "SELECT * FROM `AGRICULTURAL.LOANS`";
conn.query(query, (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }

    const dates = rows.map(row => row.Date);
    const cashflows = rows.map(row => row.Amount);

    // Calculate XIRR for loan
    const xirrValue =  xirr(cashflows, dates, 0.1);
    if (!isNaN(xirrValue)) {
        console.log("XIRR: " + xirrValue);
    } else {
        console.log("XIRR calculation failed.");
    }

    // Perform further analysis and store results in another table if needed

    // Close the database connection
    conn.end();
});
