<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$servername = 
$username = 
$password = 
$dbname = 

require 'PHPMailer-master/PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/PHPMailer-master/src/SMTP.php';


// Connessione al database
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connessione fallita: " . $conn->connect_error]));
}

$email = $_POST['email'];

if (empty($email)) {
    die(json_encode(["success" => false, "message" => "Email obbligatoria"]));
}

// Verifica se l'email esiste nel database
$stmt = $conn->prepare("SELECT * FROM Dati_Utente WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Email non trovata"]);
    exit;
}

$user = $result->fetch_assoc();

// Verifica se la funzione random_bytes è disponibile
if (!function_exists('random_bytes')) {
    die(json_encode(["success" => false, "message" => "random_bytes non è supportato nel server."]));
}

try {
    // Genera un token sicuro
    $token = bin2hex(random_bytes(16)); // 16 byte = 32 caratteri esadecimali
    if (!$token) {
        die(json_encode(["success" => false, "message" => "Errore durante la generazione del token."]));
    }
} catch (Exception $e) {
    die(json_encode(["success" => false, "message" => "Errore durante la generazione del token: " . $e->getMessage()]));
}

// Calcola la scadenza del token (1 ora)
$expires = time() + 3600; // 1 ora

// Salva il token nel database
$stmt = $conn->prepare("UPDATE Dati_Utente SET reset_token=?, reset_expires=? WHERE email=?");
$stmt->bind_param("sis", $token, $expires, $email);
$stmt->execute();

//crea il link di reset
$resetLink = "http://localhost:3001/reset-password?token=" . $token;

//invia l'email
$mail = new PHPMailer(true);

try {
    //Configura il server SMTP
    //impostazioni del server SMTP
    $mail->isSMTP(); // invio tramite SMTP
    $mail->Host = 'smtp.webme.it'; //impostiamo il server SMTP per inviare l'email
    $mail->SMTPAuth = true; //abilita l'autenticazione
    $mail->Username = 'presales2@redwebfactory.it'; //Username di SMTP
    $mail->Password = 'Rh0Rgq5498'; //Password di SMTP
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; //abilitazione della crittografia TLS; PHPMailer::ENCRYPTION_SMTPS (consigliato)
    $mail->Port = 587; //porta tcp a cui connettersi, si usa 465 per PHPMailer::ENCRYPTION_SMTPS

    //Destinatari
    $mail->setFrom('form@example.com', 'Mailer');
    $mail->addAddress($email); //aggiungiamo il destinatario

    //Contenuto
    $mail->isHTML(true);
    $mail->Subject = "Reset della password";
    $mail->Body = "Ciao, <br> Per favore clicca il link seguente per resettare la tua password: <a href='{$resetLink}'>Resetta la password</a>";
    $mail->AltBody = "Ciao, \n Per favore vai al seguente link per resettare la tua password: {$resetLink}";

    //Invia l'email
    $mail->send();

    //Risposta al client
    echo json_encode(["success" => true, "message" => "Email inviata per il reset della password", "token" => $token]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Errore durante l'invio dell'email: {$mail->ErrorInfo}"]);
}

$stmt->close();
$conn->close();
