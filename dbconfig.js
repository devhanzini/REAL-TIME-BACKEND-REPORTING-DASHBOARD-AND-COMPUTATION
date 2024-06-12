
const config = 

 { 
server: "10.0.0.183",
driver : "msnodesqlv8",
database : "CBUReportDB",
user:"IFRS_TEST",
password:"Grace$58678",
options : {
    trustedConnection : true,
    enableArithAbort: true,
    instancename : "",
    encrypt: false},



// port : 1433
// port:4096

pool: {  max: 20, 
    min: 0,         
    idleTimeoutMillis: 1000000,}

 }






module.exports = config;



