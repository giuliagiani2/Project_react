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

// Query per ottenere le valutazioni
$stmt = $conn->prepare("
    SELECT corso_id, valutazione 
    FROM Valutazioni 
    WHERE utente_id = ?
");
$stmt->bind_param("i", $utente_id);
$stmt->execute();
$result = $stmt->get_result();

$valutazioni = [];
while ($row = $result->fetch_assoc()) {
    $valutazioni[] = $row;
}

echo json_encode(["success" => true, "valutazioni" => $valutazioni]);

$stmt->close();
$conn->close();
?>
