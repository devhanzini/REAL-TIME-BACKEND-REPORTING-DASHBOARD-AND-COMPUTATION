<?php 
if(isset($_GET)){
$data= file_get_contents("php://input");
$result = json_decode($data, true);
echo json_encode($result);
}
?> 