<?php
//Seteo el content-type de salida
header('Content-type: application/xml');
//URL de donde tomar el rss debe ser pasada por GET
$RSS_URL = $_GET['url'];
//Abrimos la url como un archivo
$handle = fopen($RSS_URL, "r");

if ($handle) {
    //Concatenamos todo el XML del rss
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        //Devolvemos la salida en XML
        echo $buffer;
    }
    //Cerramos el archivo
    fclose($handle);
}
?>
