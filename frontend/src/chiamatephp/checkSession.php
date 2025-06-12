<?php

function checkSession()
{
    if (!isset($_COOKIE['user_id']) || !isset($_COOKIE['last_access'])) {
        return false; // Se i cookie non sono impostati, l'utente non è autenticato
    }

    // Decodifica e verifica l'ID dell'utente
    $utente_id = base64_decode($_COOKIE['user_id']);
    $lastAccess = base64_decode($_COOKIE['last_access']);

    // Controlla se il cookie ha superato la scadenza di 30 giorni
    if (time() - $lastAccess > 30 * 24 * 60 * 60) {
        // Se scaduto, distruggi i cookie e ritorna false
        setcookie('user_id', '', time() - 3600, "/");
        setcookie('last_access', '', time() - 3600, "/");
        return false;
    }
    //Aggiorna la data di accesso se l'utente è ancora valido
    setcookie('last_acess', base64_encode(time()), time() + (30 * 24 * 60 * 60), "/");

    // Restituisci l'ID utente se l'utente è autenticato
    return $utente_id;
}
