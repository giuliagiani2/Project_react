<?php 
session_start();

//funzione per verificare se l'utente è loggato
function isAuthenticated(){
    return isset($_SESSION['token'])&& !empty($_SESSION['token']);
}

//esegui il controllo prima di ogni operazione sensibile
if (!isAuthenticated()) {
    //se l'utente non è loggato, invia una risposta di errore
    http_response_code(403);  //
    echo json_encode(['message'=>'Accesso non autorizzato.']);
    exit();
}


// L'utente è autenticato, procedi con l'elaborazione
?>