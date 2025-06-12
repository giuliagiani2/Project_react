<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Dati di accesso al database
$servername = 
$username = 
$password 
$dbname = 

// Connessione al database
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica della connessione
if ($conn->connect_error) {
    error_log("Errore di connessione: " . $conn->connect_error);  // Log dell'errore di connessione
    echo json_encode(["success" => false, "message" => "Errore di connessione al database"]);
    exit();
}

// Verifica se l'utente_id è presente nella richiesta GET
if (!isset($_GET['utente_id'])) {
    echo json_encode(["success" => false, "message" => "ID utente mancante"]);
    exit();
}

$utente_id = $_GET['utente_id'];
//error_log("Verifica utente con ID: " . $utente_id);  // Log dell'ID utente ricevuto

// Otteniamo i dati dell'utente dal database "Dati_Utente"
$query_utente = "SELECT nome, cognome, email, telefono, indirizzo FROM Dati_Utente WHERE utente_id=?";
$stmt = $conn->prepare($query_utente);
if (!$stmt) {
    error_log("Errore preparazione query: " . $conn->error);  // Log errore preparazione query
    echo json_encode(["success" => false, "message" => "Errore nella preparazione della query"]);
    exit();
}

$stmt->bind_param("i", $utente_id);
$stmt->execute();

if ($stmt->error) {
    error_log("Errore nell'esecuzione della query: " . $stmt->error);  // Log errore esecuzione query
    echo json_encode(["success" => false, "message" => "Errore nell'esecuzione della query"]);
    exit();
}

$result = $stmt->get_result();
$user_data = $result->fetch_assoc();

if (!$user_data) {
    echo json_encode(["success" => false, "message" => "Utente non trovato."]);
    exit();
}

error_log("Dati utente trovati: " . json_encode($user_data));  // Log dei dati utente trovati

// Otteniamo i dati dell'abbonamento dell'utente dal database "Abb_Acquistati"
$query_abbonamento = "SELECT scadenza FROM Abb_acquistati WHERE utente_id=? ORDER BY data_acq DESC LIMIT 1";
$stmt_abb = $conn->prepare($query_abbonamento);
if (!$stmt_abb) {
    error_log("Errore preparazione query abbonamento: " . $conn->error);  // Log errore preparazione query abbonamento
    echo json_encode(["success" => false, "message" => "Errore nella preparazione della query abbonamento"]);
    exit();
}

$stmt_abb->bind_param("i", $utente_id);
$stmt_abb->execute();

if ($stmt_abb->error) {
    error_log("Errore nell'esecuzione della query abbonamento: " . $stmt_abb->error);  // Log errore esecuzione query abbonamento
    echo json_encode(["success" => false, "message" => "Errore nell'esecuzione della query abbonamento"]);
    exit();
}

$result_abb = $stmt_abb->get_result();
$abbonamento = $result_abb->fetch_assoc();

if ($abbonamento) {
    $user_data['scadenza'] = $abbonamento['scadenza'];
} else {
    $user_data['scadenza'] = null;
}

echo json_encode(["success" => true, "data" => $user_data]);

$stmt->close();
$stmt_abb->close();
$conn->close();
