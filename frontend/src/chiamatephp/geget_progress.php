<?php
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"]==="OPTIONS") {
    http_response_code(200);
    exit();
}

//Visualizzazione degli errori
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Dati di accesso al database
$servername="db28.web.it";
$username="sitidi_452";
$password="xipTH67x";
$dbname="sitidi_452";

//Connessione al database
$conn=new mysqli($servername, $username, $password, $dbname);

//Verifica della connessione
if ($conn->connect_error) {
    die("Coonessione fallita: " . $conn->connect_error);
}

?>