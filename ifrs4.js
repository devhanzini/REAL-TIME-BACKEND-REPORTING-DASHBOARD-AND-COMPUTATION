var config = require ("./dbconfig");
const sql = require ("mssql/msnodesqlv8");
const sql = require('mssql');
 
// Define the XNPV function
function xnpv(rate, values, dates) {
    const dateDiffs = dates.map(date => (date - dates[0]) / 365.0);
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i] / Math.pow(1 + rate, dateDiffs[i]);
    }
    return sum;
}
 
// Define the XIRR function
function xirr(values, dates, guess) {
    try {
        const xirrValue = newton(rate => xnpv(rate, values, dates), guess);
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

// Connect to SQL Server
sql.connect(config)
    .then(() => {
        // Query data from the database
        return sql.query`SELECT DISTINCT LoanId FROM [dbo].[AGRICULTURAL.LOANS]`; // Extract distinct Loan IDs
    })
    .then(result => {
        const loanIds = result.recordset.map(row => row.LoanId);
 
        // Loop through each loan ID
        loanIds.forEach(loanId => {
            // Query dates and cashflows for the current loan ID
            sql.query`SELECT Date, Amount FROM [dbo].[AGRICULTURAL.LOANS] WHERE LoanId = ${loanId}`
                .then(result => {
                    const rows = result.recordset;
                    const dates = rows.map(row => row.Date);
                    const cashflows = rows.map(row => row.Amount);
 
                    // Calculate XIRR for the loan
                    const xirrValue = xirr(cashflows, dates, 0.1);
                    console.log(`Loan ID: ${loanId}`);
                    if (!isNaN(xirrValue)) {
                        console.log("XIRR: " + xirrValue);
                    } else {
                        console.log("XIRR calculation failed.");
                    }
 
                    // Calculate XNPV for the loan
                    const xnpvValue = xnpv(0.1, cashflows, dates);
                    console.log("XNPV: " + xnpvValue);
 
                    // Perform IFRS loss and gain calculation for a specific day
                    const specificDay = new Date('2024-03-29'); // Change this to your desired date
                    const specificDayCashflows = cashflows.filter((cf, index) => new Date(dates[index]).getTime() === specificDay.getTime());
                    const specificDayXnpvValue = xnpv(0.1, specificDayCashflows, [specificDay.getTime()]);
                    const ifrsLossGain = specificDayXnpvValue - xnpvValue;
                    console.log(`IFRS Loss/Gain on ${specificDay.toDateString()}: ${ifrsLossGain}`);
 
                    // Close the connection
                    sql.close();
                })
                .catch(err => {
                    console.error(err);
                });
        });
    })
    .catch(err => {
        console.error(err);
    });