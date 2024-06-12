
(async () => {

    try {

        // Connect to SQL Server

       let pool =  await sql.connect(config);
 
        // Query data from the database for the specified product ID

        let result = await sql.query`SELECT DATES, CASH_FLOW_TYPE, CASH_FLOW_AMT FROM [dbo].[HRM.LOANS] WHERE PRODUCT_ID = ${productId}`;

        const rows = result.recordset;
 
        // Loop through each row

        for (const row of rows) {

            const date = row.DATES;

            const cashFlowType = row.CASH_FLOW_TYPE;
 
            // Query cash flows for the current date and specified product ID

            const cashFlowResult = await sql.query`SELECT CASH_FLOW_AMT FROM [dbo].[HRM.LOANS] WHERE DATES <= ${date} AND PRODUCT_ID = ${productId}`;

            const cashFlows = cashFlowResult.recordset.map(row => row.CASH_FLOW_AMT);
 
            // Check if cashFlows is not empty

            if (cashFlows.length === 0) {

                console.error("No cash flows found for the current date.");

                continue; // Skip to the next iteration

            }
 
            // Calculate XNPV for the date

            const xnpvValue = xnpv(0.1, cashFlows, [new Date(date).getTime()]);
 
            // Calculate carrying loan amount (sum of cash flows from the first date of the loan to the current date)

            const carryingLoanAmount = cashFlows.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
 
            // Calculate IFRS loss and gain

            const ifrsLoss = xnpvValue - carryingLoanAmount;

            const ifrsGain = carryingLoanAmount - xnpvValue;
 
            // Calculate XIRR for the date

            const xirrValue = xirr(cashFlows, [new Date(date).getTime()], 0.1);
