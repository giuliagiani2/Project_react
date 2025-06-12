<?php
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Dati di accesso al database
$servername = 
$username = 
$password = 
$dbname = 

// Connessione al database
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}

// Recupero dati
$utente_id = $_GET['utente_id'];

if (!is_numeric($utente_id)) {
    echo json_encode(["success" => false, "message" => "ID utente non valido"]);
    exit();
}

// Query per ottenere i corsi iscritti
$stmt = $conn->prepare("
    SELECT Corsi.id, Corsi.titolo, Corsi.descrizione 
    FROM Iscrizioni 
    INNER JOIN Corsi ON Iscrizioni.corso_id = Corsi.id 
    WHERE Iscrizioni.utente_id = ?
");
$stmt->bind_param("i", $utente_id);
$stmt->execute();
$result = $stmt->get_result();

$corsi = [];
while ($row = $result->fetch_assoc()) {
    $corsi[] = $row;
}

error_log("Corsi iscritti per utente_id $utente_id: " . json_encode($corsi)); // Log dei corsi iscritti

echo json_encode(["success" => true, "corsi" => $corsi]);

$stmt->close();
$conn->close();
?>