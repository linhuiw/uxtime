<?php
$fp = fsockopen("mail.rongjinhardware.com",25,&$errno,&$errstr,60); 
if(! $fp) 
    echo '$errstr   ($errno) <br> \n '; 
else 
    echo 'ok <br> \n ';
?>