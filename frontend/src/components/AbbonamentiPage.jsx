import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Card, CardContent, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";


const AbbonamentiPage = () => {
    const [abbonamenti, setAbbonamenti] = useState([]);
    const [abbonamentoAttivo, setAbbonamentoAttivo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fecthAbbonamenti();
        verificaAbbonamentoUtente();
    })

    //funzione per recuperare i dati dal server
    const fecthAbbonamenti = async () => {
        try {
            const response = await fetch("https://test5.redweblab.it/get_abbonamenti.php");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            setAbbonamenti(data);
        } catch (error) {
            setError("Errore nel recupero degli abbonamenti.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const verificaAbbonamentoUtente = async () => {
        const utente_id = sessionStorage.getItem("utente_id");
        if (!utente_id) {
            return;
        }

        try {
            const response = await fetch(`https://test5.redweblab.it/verifica_abbonamento.php?utente_id=${utente_id}`);
            const data = await response.json();

            if (data.attivo) {
                setAbbonamentoAttivo(data);
            }
        } catch (error) {
            console.error("Errore nel controllo dell'abbonamento:", error);
        }
    }

    const handleAbbonamento = (abbonamento) => {
        const utente_id = sessionStorage.getItem("utente_id");

        if (!utente_id) {
            alert("Devi effettuare il login prima di acquistare l'abbonamento.");
            navigate("/login");
            return;
        }

        console.log("Abbonamento selezionato: ", abbonamento);
        sessionStorage.setItem("AbbonamentoSelezionato", JSON.stringify(abbonamento));
        navigate("/pagamento"); // Reindirizza alla pagina di pagamento
    }

    if (loading) return <Typography variant="h6">Caricamento ...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: "white", textAlign: "center" }}>
                Scegli il tuo abbonamento
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                {
                    abbonamenti.length > 0 ? (
                        abbonamenti.map((abb) => (
                            <Grid item xs={12} sm={6} md={3} key={abb.id}>
                                <Card sx={{ padding: 1, maxWidth: 450 }}>
                                    <CardContent>
                                        <Typography variant="h6">{abb.tipo_abbonamento}</Typography>
                                        <Typography variant="h6" gutterBottom>
                                            <span style={{ fontSize: "18px", fontWeight: "bold" }}>€ {abb.costo_normale}</span> / mese
                                        </Typography>
                                        <Typography variant="body2">
                                            {abb.descrizione || "Descrizione non disponibile"}
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                {
                                                    abb.caratteristiche && Array.isArray(abb.caratteristiche) &&
                                                        abb.caratteristiche.length > 0 ? (
                                                        abb.caratteristiche.map((carat, index) => (
                                                            <li key={index} style={{ fontSize: '14px' }}>{carat}</li>
                                                        ))
                                                    ) : (
                                                        <li>Nessuna caratteristica disponibile.</li>
                                                    )
                                                }
                                            </ul>
                                        </Box>
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleAbbonamento(abb)}
                                            >
                                                Prova gratis
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                onClick={() => handleAbbonamento(abb)}
                                                sx={{ ml: 2 }}
                                            >
                                                Acquista
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ mt: 3 }}>
                            Non sono presenti abbonamenti.
                        </Typography>
                    )
                }
            </Grid>
        </Box>
    );
}

export default AbbonamentiPage;