<!DOCTYPE html>
<html>
<head>
 <title>LOAN_TABLE</title>
 <style type="text/css">
     table {
border-collapse: collapse;
width: 100%;
color: #d96459;
font-family:monospace;
font-size:25px;
text-align: left;
     }
th { background-color: : #d96459;
    color: red;
}
tr:nth-child(even) {background-color: #f2f2f2}
 </style>

</head>
<body>
    <table>
        <tr>
            <th>PRINCIPAL_AMOUNT</th>
            <th>INTEREST_RATE</th>
            <th>TERM</th>
            <th>SIMPLE_INTEREST</th>
        </tr>
        <?php 
        $conn = mysqli_connect('localhost', 'root', 'Hanzini77$$', 'ifrs_reporting');
        if($conn-> connect_error)   {
        die("Connection failed:" . $conn-> connct_error);
    }
        $sql =  "SELECT principal_amount, interest_rate, term, simple_interest from loan_table" ;

        $result = $conn-> query($sql);


        if($result-> num_rows > 0)  {

        while($row = $result-> fetch_assoc()) {
        echo "<tr><td>" . $row["principal_amount"] . "</td><td>" . $row["interest_rate"] . "</td><td>". $row["term"] . "</td><td>". $row["simple_interest"] . "</td><tr>";
    }
    echo "</table>";
    }
    else{
    echo "0 result";   
}
    $conn-> close();
    ?>
    
</table>

                    <td><a class="btn btn-info" href="export_excel.php">Save as Excel</a></td>

</body>
</html>