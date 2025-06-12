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
$immagine = $data['immagine'];

$stmt = $conn->prepare("INSERT INTO Canali (titolo, descrizione, immagine) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $titolo, $descrizione, $immagine);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Canale aggiunto con successo"]);
} else {
    echo json_encode(["success" => false, "message" => "Errore durante l'aggiunta del canale"]);
}

$stmt->close();
$conn->close();
?>
