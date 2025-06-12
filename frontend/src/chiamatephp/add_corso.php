<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = 
$username = 
$password = 
$dbname = 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connessione fallita: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$titolo = $data['titolo'];
$descrizione = $data['descrizione'];
$id_canale = $data['id_canale'];

$stmt = $conn->prepare("INSERT INTO Corsi (titolo, descrizione, id_canale) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $titolo, $descrizione, $id_canale);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Corso aggiunto con successo"]);
} else {
    echo json_encode(["success" => false, "message" => "Errore durante l'aggiunta del corso"]);
}

$stmt->close();
$conn->close();
?>
