<?php
ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:4000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");  // Imposta il tipo di contenuto come JSON

$servername = 
$username = 
$password =
$dbname = 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}


$token = $_POST['token'];
$password_utente = $_POST['password'];

if (empty($token) || empty($password_utente)) {
    echo json_encode(["success" => false, "message" => "Token o password mancati"]);
    exit;
}

// Crea una variabile per il timestamp di scadenza
$current_time = time();

//controlla se il token è valido
$stmt = $conn->prepare("SELECT * FROM Dati_Utente WHERE reset_token=? AND reset_expires >?");
$stmt->bind_param("si", $token, $current_time); // Passa la variabile $current_time
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Token non valido o scaduto"]);
    exit;
}

$user = $result->fetch_assoc();

// Hash della nuova password
$hashed_password = password_hash($password_utente, PASSWORD_DEFAULT);

// Aggiorna la password nel database
$stmt_update = $conn->prepare("UPDATE Dati_Utente SET psw=?, reset_token=NULL, reset_expires=NULL WHERE email=?");
$stmt_update->bind_param("ss", $hashed_password, $user['email']);
$updateResult = $stmt_update->execute();

// Verifica se l'update è andato a buon fine
if ($updateResult) {
    echo json_encode(["success" => true, "message" => "Password aggiornata con successo"]);
} else {
    echo json_encode(["success" => false, "message" => "Errore durante l'aggiornamento della password"]);
}

$stmt->close();
$stmt_update->close();
$conn->close();
