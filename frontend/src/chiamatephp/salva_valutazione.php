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

if (!isset($data['utente_id'], $data['corso_id'], $data['valutazione'])) {
    echo json_encode(["success" => false, "message" => "Dati mancanti"]);
    exit();
}

$utente_id = $data['utente_id'];
$corso_id = $data['corso_id'];
$valutazione = $data['valutazione'];

// Verifica che i dati siano validi
if (!is_numeric($utente_id) || !is_numeric($valutazione) || empty($corso_id)) {
    error_log("Errore: dati non validi. utente_id: $utente_id, corso_id: $corso_id, valutazione: $valutazione");
    echo json_encode(["success" => false, "message" => "Dati non validi"]);
    exit();
}

// Recupera la valutazione precedente
$stmt = $conn->prepare("SELECT valutazione FROM Valutazioni WHERE utente_id = ? AND corso_id = ?");
$stmt->bind_param("is", $utente_id, $corso_id);
$stmt->execute();
$result = $stmt->get_result();
$valutazione_precedente = $result->fetch_assoc()['valutazione'];
$stmt->close();

// Inserimento o aggiornamento della valutazione
$stmt = $conn->prepare("INSERT INTO Valutazioni (utente_id, corso_id, valutazione) VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE valutazione = VALUES(valutazione)");
$stmt->bind_param("isd", $utente_id, $corso_id, $valutazione);

if ($stmt->execute()) {
    // Salva un log della modifica
    $stmt_log = $conn->prepare("INSERT INTO Valutazioni_Log (utente_id, corso_id, valutazione_precedente, valutazione_nuova, data_modifica) 
                                VALUES (?, ?, ?, ?, NOW())");
    $stmt_log->bind_param("isdd", $utente_id, $corso_id, $valutazione_precedente, $valutazione);
    $stmt_log->execute();
    $stmt_log->close();

    echo json_encode(["success" => true, "message" => "Valutazione salvata con successo"]);
} else {
    error_log("Errore MySQL: " . $conn->error); // Log dell'errore MySQL
    echo json_encode(["success" => false, "message" => "Errore durante il salvataggio della valutazione"]);
}

$stmt->close();
$conn->close();
?>
