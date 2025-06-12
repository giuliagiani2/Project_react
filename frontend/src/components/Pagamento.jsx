import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, CardContent, Card, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Pagamento = () => {
    const [abbonamento, setAbbonamento] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAbbonamento = async () => {
            try {
                setLoading(true);
                const utente_id = sessionStorage.getItem("utente_id");

                if (!utente_id) {
                    setError("Devi effettuare il login per acquistare un abbonamento.");
                    return;
                }

                // Controlla se l'utente ha già un abbonamento attivo
                const responseAbb = await fetch(`https://test5.redweblab.it/verifica_abbonamento.php?utente_id=${utente_id}`);
                const dataAbb = await responseAbb.json();

                if (dataAbb.attivo) {
                    setError("Hai già un abbonamento attivo. Puoi rinnovarlo solo alla scadenza.");
                    setInterval(() => {
                        navigate("/area-riservata");
                    }, 2000);

                    return;
                }

                const abbonamentoSelezionato = JSON.parse(sessionStorage.getItem("AbbonamentoSelezionato"));
                if (!abbonamentoSelezionato) {
                    setError("Nessun abbonamento selezionato.");
                    return;
                }

                setAbbonamento(abbonamentoSelezionato);
            } catch (err) {
                setError("Errore nel caricamento dell'abbonamento.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAbbonamento();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        const utente_id = sessionStorage.getItem("utente_id");
        if (!utente_id) {
            setError("Devi essere autenticato per completare il pagamento.");
            setLoading(false);
            return;
        }

        const abbonamentoSelezionato = JSON.parse(sessionStorage.getItem("AbbonamentoSelezionato"));
        if (!abbonamentoSelezionato) {
            setError("Errore: nessun abbonamento selezionato.");
            setLoading(false);
            return;
        }

        const data = {
            utente_id: utente_id,
            tipo_abbonamento: abbonamentoSelezionato.tipo_abbonamento,
            costo_normale: abbonamentoSelezionato.costo_normale,
            data_acquisto: new Date().toISOString().split("T")[0], // Data di oggi
        };

        try {
            console.log("Invio dati per acquisto: ", data);

            const response = await fetch("https://test5.redweblab.it/acquisto_abbonamento.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const textResponse = await response.text();
            console.log("Risposta JSON dal server: ", textResponse);

            try {
                const responseData = JSON.parse(textResponse);
                console.log("Risposta JSON dat server: ", responseData);

                if (responseData.success === true) {
                    sessionStorage.removeItem("AbbonamentoSelezionato");
                    navigate("/successo");
                    setTimeout(() => navigate("/login"), 2000);
                } else {
                    setError("Errore nell'acquisto dell'abbonamento: " + responseData.message);
                }
            } catch (error) {
                console.error("Errore nel parsing del JSON", error);
                setError("Errore nella comunicazione con il server.");
            }
        } catch (error) {
            console.error("Errore nell'invio dei dati:", error);
            setError("Errore nell'invio dei dati al server.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!abbonamento) {
        return (
            <Typography variant="h6" sx={{ textAlign: "center", marginTop: 4 }}>
                Nessun abbonamento selezionato.
            </Typography>
        );
    }

    return (
        <Box minHeight="95vh" sx={{ padding: 4, maxWidth: 600, margin: "auto" }} >
            <Card sx={{ backgroundColor: "#333", color: "white" }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center">
                        Pagamento per l'abbonamento
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
                        {abbonamento?.tipo_abbonamento}
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ marginBottom: 2 }}>
                        Prezzo: € {abbonamento?.costo_normale} / mese
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                                    Completa pagamento
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Pagamento;
