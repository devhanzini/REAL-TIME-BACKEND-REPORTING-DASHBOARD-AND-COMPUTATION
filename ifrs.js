var config = require("./dbconfig");
const sql = require ("mssql/msnodesqlv8");



// Define the XNPV function
function xnpv(rate, values, dates) {
    const date_diffs = dates.map(date => (date - dates[0]) / 365.0);
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i] / Math.pow(1 + rate, date_diffs[i]);
    }
    return sum;
}

// Define the XIRR function
function xirr(values, dates, guess) {
    try {
        const xirrValue = newton(r => xnpv(r, values, dates), guess);
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

// Function interface for mathematical functions
function calculate(x) {
    // You need to implement your mathematical function here
    // For example:
    // return Math.sin(x) - x;
}

// Main function
function main() {
    // You need to implement your database connection and query here
    // For example:
    // const dbURL = "your_database_url";
    // const query = "your_database_query";
    // const datesList = [];
    // const cashflowsList = [];
    // Fetch data from the database and populate datesList and cashflowsList

    // Sample data for demonstration
    const datesList = [0, 365, 730];
    const cashflowsList = [-10000, 2000, 5000];

    // Convert lists to arrays
    const dates = datesList;
    const cashflows = cashflowsList;

    // Calculate XIRR for loan
    const xirrValue = xirr(cashflows, dates, 0.1);
    if (!isNaN(xirrValue)) {
        console.log("XIRR: " + xirrValue);
    } else {
        console.log("XIRR calculation failed.");
    }

    // Perform further analysis and store results if needed
}

// Call the main function
main();
