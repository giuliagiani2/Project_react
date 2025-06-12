<?php
function calcoloScadenza($data_acquisto, $tipo_abbonamento)
{
    // Imposta la timezone
    date_default_timezone_set('Europe/Rome');

    $data_acquisto_timestamp = strtotime($data_acquisto);

    // Verifica se la data di acquisto è valida
    if ($data_acquisto_timestamp === false) {
        return "Errore: Data di acquisto non valida";
    }

    switch ($tipo_abbonamento) {
        case '3_mesi':
            $scadenza_timestamp = strtotime("+3 months", $data_acquisto_timestamp);
            break;

        case '1_anno':
            $scadenza_timestamp = strtotime("+1 year", $data_acquisto_timestamp);
            break;

        case 'illimitato':
            return "Mai"; //non scade mai
            break;
        default:
            return "Sconosciuto";
            break;
    }
    return date("Y-m-d H:i:s", $scadenza_timestamp); //verifica se la data attuale è successiva alla data di scadenza
}
?>