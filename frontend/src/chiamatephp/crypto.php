<?php

// Funzione per criptare i dati
function encrypt_data($data, $key, $iv) {
    if ($data === null) {
        die(json_encode(["success" => false, "message" => "Dati mancanti per la criptazione"]));
    }

    // Usa openssl_encrypt solo se i dati sono validi
    $encrypted_data = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);

    if ($encrypted_data === false) {
        die(json_encode(["success" => false, "message" => "Errore nella criptazione dei dati"]));
    }

    return $encrypted_data;
}