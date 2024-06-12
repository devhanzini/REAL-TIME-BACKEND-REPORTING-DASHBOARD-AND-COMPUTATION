async function getsmallbussloan_withQuery(){
    try {
        let pool = await sql.connect(config);
        let res = await sql.query`SELECT DISTINCT PRODUCT_ID FROM [dbo].[HRM.LOANS]`;
     }) // Extract distinct Loan IDs
    .then(result => {
        const PRODUCT_IDS = result.recordset.map(row => row.PRODUCT_ID);
 
        // Loop through each loan ID
        PRODUCT_IDS.forEach(PRODUCT_ID => {
            // Query dates and cashflows for the current loan ID
            sql.query`SELECT DATES,CASH_FLOW_TYPE ,CASH_FLOW_AMT FROM [dbo].[HRM.LOANS] WHERE PRODUCT_ID = ${PRODUCT_ID}`
                .then(result => {
                    const rows = result.recordset;
                    const dates = rows.map(row => row.DATES);
                    const cashflows = rows.map(row => row.CASH_FLOW_AMT);
 
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
    });

         return res.recordsets;



    }    
    catch (error) {
    console.log("mathus-error :" + error);
        
    };





    