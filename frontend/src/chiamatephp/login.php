<?php
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Permette richieste da qualsiasi origine
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Permette solo POST e OPTIONS
header("Access-Control-Allow-Headers: Content-Type"); // Permette l'header Content-Type

// Gestione richiesta preflight (CORS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

//visualizzazioen degli errori
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//dati di accesso al database
$servername = 
$username = 
$password = 
$dbname = 

//connessione al database
$conn = new mysqli($servername, $username, $password, $dbname);

//verifica della connessione
if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}

// Legge i dati inviati da React
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$password = $data['password'];

// Debug: Controlla se i dati sono ricevuti correttamente
// error_log("Email ricevuta: " . $email);
// error_log("Password ricevuta: " . $password);

// Cerca l'utente nel database
$query = "SELECT utente_id, psw FROM Dati_Utente WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$utente = $result->fetch_assoc();

if (!$utente) {
    echo json_encode(["success" => false, "message" => "Email non trovata"]);
    exit();
}

error_log("Utente trovato:" .json_encode($utente));

// Controlla la password
if (password_verify($password, $utente['psw'])) {
    // Password corretta → Utente autenticato
    echo json_encode([
        "success" => true,
        "utente_id" => $utente['utente_id'],
        "message" => "Login effettuato con successo"
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Password errata"]);
}
exit();
?>