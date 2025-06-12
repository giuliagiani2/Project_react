<?php
// Attiva la visualizzazione degli errori (utile per il debug)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// Dati per la connessione al database
$servername = 
$username =
$password = 
$dbname = 

// Connessione al database
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica connessione
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Errore di connessione al database."]));
}

// Prendiamo i dati inviati dal form React
$name = $_POST['name'];
$surname = $_POST['surname'];
$email = $_POST['email'];
$password_utente = $_POST['password'];
$telefono = $_POST['telefono'] ?? null;
$indirizzo = $_POST['indirizzo'] ?? null;
$p_iva = $_POST['p_iva'] ?? null;
$cf = $_POST['cf'] ?? null;
$data_registrazione = date("Y-m-d H:i:s"); // Data e ora attuale

//  Controllo: tutti i campi obbligatori devono essere compilati
if (empty($name) || empty($surname) || empty($email) || empty($password_utente) || empty($cf)) {
    echo json_encode(["success" => false, "message" => "Nome, Cognome, Email, Password e Codice Fiscale sono obbligatori."]);
    exit;
}

//  Controllo: la password deve avere almeno 8 caratteri
if (strlen($password_utente) < 8) {
    echo json_encode(["success" => false, "message" => "La password deve avere almeno 8 caratteri."]);
    exit;
}

//  Controllo se l'email è già registrata
$stmt = $conn->prepare("SELECT * FROM Dati_Utente WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Utente già registrato",
        "redirectToLogin" => true
    ]);
    exit;
}

//  Hash della password prima di salvarla nel database
$hashed_password = password_hash($password_utente, PASSWORD_DEFAULT);

//  Inserimento utente nel database
$stmt_insert = $conn->prepare("INSERT INTO Dati_Utente (nome, cognome, email, psw, telefono, indirizzo, p_iva, cf, data_registrazione) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt_insert->bind_param("sssssssss", $name, $surname, $email, $hashed_password, $telefono, $indirizzo, $p_iva, $cf, $data_registrazione);

if ($stmt_insert->execute()) {
    echo json_encode(["success" => true, "message" => "Registrazione completata con successo!"]);
} else {
    echo json_encode(["success" => false, "message" => "Errore durante la registrazione."]);
}

// Chiudiamo le connessioni
$stmt->close();
$stmt_insert->close();
$conn->close();
?>
