<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

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

include 'calcoloScadenza.php';

if (!isset($_GET['utente_id'])) {
    echo json_encode(["attivo"=>false, "errore"=>"ID utente mancante."]);
    exit();
}

$utente_id = $_GET['utente_id'];

error_log("Verifica abbonamento per utente_id: " . $utente_id);

$query = "SELECT * FROM Abb_acquistati WHERE utente_id = ? ORDER BY data_acq DESC LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $utente_id);
$stmt->execute();
$result = $stmt->get_result();
$abbonamento = $result->fetch_assoc();

if (!$abbonamento) {
    echo json_encode(["attivo" => false, "errore" => "Nessun abbonamento trovato per questo utente."]);
    exit();
}

$data_scadenza = strtotime($abbonamento['scadenza']);
$oggi = strtotime(date("Y-m-d"));

if ($data_scadenza >= $oggi || $abbonamento['scadenza'] === null) {
    echo json_encode(["attivo" => true, "scadenza" => $abbonamento['scadenza']]);
} else {
    echo json_encode(["attivo" => false, "scadenza" => $abbonamento['scadenza']]);
}
exit();
?>