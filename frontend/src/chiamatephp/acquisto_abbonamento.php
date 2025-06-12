<?php
// Abilita CORS per consentire le richieste da domini diversi
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

//dati di accesso al database
$servername = 
$username = 
$password = 
$dbname = 


// Gestisci la richiesta OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la connessione
if ($conn->connect_error) {
    throw new Exception('Errore di connessione al database: ' . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

// **DEBUG: Controlla se i dati vengono ricevuti**
error_log("Dati ricevuti: " . json_encode($data));

// Controlla se i dati sono validi
if (!isset($data['utente_id']) || !isset($data['tipo_abbonamento']) || !isset($data['costo_normale'])) {
    echo json_encode(["success" => false, "message" => "Dati mancanti"]);
    exit();
}

$utente_id = $data['utente_id'];
$tipo_abbonamento = $data['tipo_abbonamento'];
$costo_normale = $data['costo_normale'];
$data_acquisto = date("Y-m-d");

// Controlla se l'utente ha già un abbonamento attivo
$queryCheck = "SELECT * FROM Abb_acquistati WHERE utente_id = ? AND scadenza >= CURDATE()";
$stmtCheck = $conn->prepare($queryCheck);
$stmtCheck->bind_param("i", $utente_id);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();

if ($resultCheck->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Hai già un abbonamento attivo."]);
    exit();
}

// Calcola la scadenza dell'abbonamento
$scadenza = match ($tipo_abbonamento) {
    "3 mesi" => date("Y-m-d", strtotime("+3 months", strtotime($data_acquisto))),
    "1 anno" => date("Y-m-d", strtotime("+1 year", strtotime($data_acquisto))),
    default => null, // Illimitato
};

// Genera codice univoco dell'abbonamento
$codice_univoco = "ABB2025-" . strtoupper(str_replace(" ", "", $tipo_abbonamento)) . "-" . uniqid();

//controlla i dati prima di inserirli nel database
error_log("Salvataggio abbonamento - Utente ID: $utente_id, Tipo: $tipo_abbonamento, Costo: $costo_normale, Scadenza: $scadenza, codice: $codice_univoco");

// Registra l'abbonamento nel database
$query = "INSERT INTO Abb_acquistati (utente_id, tipo_abb, data_acq, costo_normale, scadenza, code_univoco) 
          VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("issdss", $utente_id, $tipo_abbonamento, $data_acquisto, $costo_normale, $scadenza, $codice_univoco);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Abbonamento attivato con successo"]);
} else {
    echo json_encode(["success" => false, "message" => "Errore durante l'attivazione"]);
}
exit();
