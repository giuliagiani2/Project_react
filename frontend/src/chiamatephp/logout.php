<?php
session_start();

//distruggo il token di sessione
unset($_SESSION['token']); //rimuove il token dalla sessione
session_destroy(); //distrugge la sessione

//Rimuovi i cookie
setcookie('user_id', '', time()-3600, "/"); //rimuove il cookie 'user_id'
setcookie('user_email', '', time()-3600, "/"); //rimuove il cookie 'user_email'
setcookie('token', '', time()-3600, '/'); //rimuove il cookie 'token'

//restituisce una risposta JSON
$response = [
    'success' => true,
    'message' => 'Logout effettuato con successo',
];

header('Content-Type: application/json');
echo json_encode($response);
