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
$url_video = $data['url_video'];
$immagine = $data['immagine'];
$id_corso = $data['id_corso'];

$stmt = $conn->prepare("INSERT INTO Video (titolo, descrizione, url_video, immagine, id_corso) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssssi", $titolo, $descrizione, $url_video, $immagine, $id_corso);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Video aggiunto con successo"]);
    echo json_encode(["success" => false, "message" => "Dati mancanti"]);
    exit();
}

$titolo = $data['titolo'];
$descrizione = $data['descrizione'];
$url_video = $data['url_video'];
$immagine = $data['immagine'];
$id_corso = $data['id_corso'];

// Inserimento del video
$stmt = $conn->prepare("INSERT INTO Video (titolo, descrizione, url_video, immagine, id_corso) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $titolo, $descrizione, $url_video, $immagine, $id_corso);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Video aggiunto con successo"]);
} else {
    echo json_encode(["success" => false, "message" => "Errore durante l'aggiunta del video"]);
}

$stmt->close();
$conn->close();
?>
