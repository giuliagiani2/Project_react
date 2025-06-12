<?php
// Connessione al database
$servername = 
$username = 
$password =
$dbname = 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Errore di connessione al database: " . $conn->connect_error);
}

// Elaborazione dei dati di pagamento
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $numeroCarta = $_POST["numeroCarta"];
    $dataScadenza = $_POST["dataScadenza"];
    $cvv = $_POST["cvv"];
    $nomeTitolare = $_POST["nomeTitolare"];

    // Inserisci qui la logica per elaborare il pagamento
    // ...

    // Aggiornamento dello stato dell'abbonamento nel database
    $idAbbonamento = $_POST["idAbbonamento"]; // Recupera l'ID dell'abbonamento
    $sql = "UPDATE Abbonamenti SET stato = 'attivo' WHERE id = $idAbbonamento";

    if ($conn->query($sql) === TRUE) {
        echo "Pagamento!";
    } else {
        echo "Errore nell'aggiornamento dell'abbonamento: " . $conn->error;
    }
}

$conn->close();
