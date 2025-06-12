<?php
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// ...existing database connection code...

$utente_id = $_GET['utente_id'];
$corso_id = $_GET['corso_id'];

if (!is_numeric($utente_id) || empty($corso_id)) {
    echo json_encode(["success" => false, "message" => "Dati non validi"]);
    exit();
}

$stmt = $conn->prepare("SELECT valutazione FROM Valutazioni WHERE utente_id = ? AND corso_id = ?");
$stmt->bind_param("is", $utente_id, $corso_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["success" => true, "valutazione" => $row['valutazione']]);
} else {
    echo json_encode(["success" => false, "message" => "Nessuna valutazione trovata"]);
}

$stmt->close();
$conn->close();
?>
