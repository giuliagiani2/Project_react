import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Snackbar } from "@mui/material";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [resetLink, setResetLink] = useState('');  // Variabile per il link di reset

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Controlla che l'email sia presente
        if (!email) {
            setError("Email obbligatoria");
            setOpenSnackbar(true);
            return;
        }

        //Validazione dell'email (formato corretto)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Email non valida");
            setOpenSnackbar(true);
            return;
        }

        try {
            // Invia la richiesta al server PHP per il reset della password
            const response = await fetch('https://test5.redweblab.it/forgot-password.php', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    email: email,
                }),
            });

            // Ottieni la risposta JSON dal server
            const data = await response.json();
            console.log("Risposta dal backend:", data); // Per il debug, verifica cosa ricevi

            // Se il server ha restituito successo
            if (data.success) {
                // Verifica se c'è un token
                if (data.token) {
                    // Qui crei il link per il reset della password
                    setResetLink(`http://localhost:3001/reset-password?token=${data.token}`);
                    //console.log("Link di reset generato: ", `http://localhost:3001/reset-password?token=${data.token}`);

                    setSuccessMessage("Il link per il reset della password è stato inviato. Copia il link sottostante:");
                    setSuccessMessage("Email inviata per il reset della password");
                } else {
                    // Se non c'è un token, mostra un errore
                    setError("Errore: Token non ricevuto.");
                }
                setOpenSnackbar(true);
            } else {
                // Se c'è un errore, mostra il messaggio dal server
                setError(data.message);
                setOpenSnackbar(true);
            }

        } catch (error) {
            // Gestisci gli errori di connessione
            setError("Errore di connessione");
            setOpenSnackbar(true);
        }
    };
    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 10, marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight:"56vh" }}>
                <Typography component="h1" variant="h5" color="white">
                    Recupera la tua password
                </Typography>

                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                        InputLabelProps={{
                            style: { color: '#90caf9' },
                        }}
                        InputProps={{
                            style: { color: '#ffffff' },
                        }}
                    />

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, color:"whitesmoke" }}>
                        Invia Email di Reset
                    </Button>

                    {/* Mostra il link di reset se è stato generato */}
                    {resetLink && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                Link di Reset: <a href={resetLink}>{resetLink}</a>
                            </Typography>
                        </Box>

                    )}
                    {
                        console.log("Reset link: ", resetLink)
                    }
                </Box>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                message={error || successMessage} />
        </Container>
    );
};

export default ForgotPasswordPage;