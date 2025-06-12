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

$servername = 
$username = 
$password = 
$dbname = 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}

// Recupero dati
$data = json_decode(file_get_contents("php://input"), true);
error_log("Dati ricevuti: " . json_encode($data)); // Log dei dati ricevuti

if (!isset($data['utente_id'], $data['corso_id'], $data['video_id'], $data['completato'])) {
    error_log("Errore: Dati mancanti. Dati ricevuti: " . json_encode($data));
    echo json_encode(["success" => false, "message" => "Dati mancanti"]);
    exit();
}

$utente_id = $data['utente_id'];
$corso_id = $data['corso_id'];
$video_id = $data['video_id'];
$completato = $data['completato'];

error_log("utente_id: $utente_id, corso_id: $corso_id (tipo: " . gettype($corso_id) . "), video_id: $video_id, completato: $completato");

// Verifica che i dati siano validi
if (!is_numeric($utente_id) || empty($corso_id) || !is_numeric($video_id)) {
    error_log("Errore: dati non validi. utente_id: $utente_id, corso_id: $corso_id, video_id: $video_id, completato: $completato");
    echo json_encode(["success" => false, "message" => "Dati non validi"]);
    exit();
}

if (!is_string($corso_id) || empty(trim($corso_id))) {
    error_log("Errore: corso_id non valido. corso_id: $corso_id");
    echo json_encode(["success" => false, "message" => "ID corso non valido"]);
    exit();
}

// Inserimento o aggiornamento del progresso
$stmt = $conn->prepare("INSERT INTO Progresso (utente_id, corso_id, video_id, completato) VALUES (?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE completato = VALUES(completato), data_completamento = CURRENT_TIMESTAMP");
$stmt->bind_param("iisi", $utente_id, $corso_id, $video_id, $completato);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Progresso salvato con successo"]);
} else {
    error_log("Errore MySQL: " . $conn->error); // Log dell'errore MySQL
    echo json_encode(["success" => false, "message" => "Errore durante il salvataggio del progresso"]);
}

$stmt->close();
$conn->close();
?>
