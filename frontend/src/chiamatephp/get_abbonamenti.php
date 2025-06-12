<?php
session_start();

header("Content-Type: application/json");

// Visualizzazione degli errori (opzionale, utile per il debug durante lo sviluppo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Dati di accesso al database
$servername = 
$username = 
$password = 
$dbname = 

// Connessione al database
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica della connessione
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Errore di connessione al database"]));
}

//recupero degli abbonamenti
$sql = "SELECT * FROM Abbonamenti";
$result = $conn->query($sql);

$abbonamenti = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        //decodifica la stringa JSON in un array se necessario
        $row['caratteristiche'] = json_decode($row['caratteristiche'], true);
        $abbonamenti[] = $row;
    }
}
//restituisci dati in formato JSON
echo json_encode($abbonamenti);

$conn->close();
