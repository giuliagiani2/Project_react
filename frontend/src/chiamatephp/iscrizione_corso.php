<?php
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
    die(json_encode(["success" => false, "message" => "Connessione fallita: " . $conn->connect_error]));
}

// Recupero dati
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['utente_id'], $data['corso_id'])) {
    echo json_encode(["success" => false, "message" => "Dati mancanti"]);
    exit();
}

$utente_id = $data['utente_id'];
$corso_id = $data['corso_id'];

// Verifica che i dati siano validi
if (!is_numeric($utente_id) || empty($corso_id)) {
    echo json_encode(["success" => false, "message" => "Dati non validi"]);
    exit();
}

// Controlla se l'utente è già iscritto al corso
$stmt = $conn->prepare("SELECT COUNT(*) AS count FROM Iscrizioni WHERE utente_id = ? AND corso_id = ?");
$stmt->bind_param("is", $utente_id, $corso_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row['count'] > 0) {
    echo json_encode(["success" => false, "message" => "Sei già iscritto a questo corso"]);
    $stmt->close();
    $conn->close();
    exit();
}

// Inserisci l'iscrizione
$stmt = $conn->prepare("INSERT INTO Iscrizioni (utente_id, corso_id, data_iscrizione) VALUES (?, ?, NOW())");
$stmt->bind_param("is", $utente_id, $corso_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Iscrizione completata con successo"]);
} else {
    echo json_encode(["success" => false, "message" => "Errore durante l'iscrizione"]);
}

$stmt->close();
$conn->close();
?>
