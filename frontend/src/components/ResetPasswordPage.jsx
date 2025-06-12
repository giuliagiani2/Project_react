import React, { useEffect, useState } from "react";
import { Container, Box, Typography, TextField, Button, Snackbar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        //verifica se il token è valido tramite una chiamata API
        const checkToken = async () => {

            try {
                const response = await fetch('https://test5.redweblab.it/reset-password.php');
                const text = await response.text(); //leggiamo la risposta come testo
                console.log("Risposta raw: ", text); //visualizza il contenuto della risposta

                //se la risposta è JSON, convertila
                try {
                    const data = JSON.parse(text);
                    setTokenValid(data.success);
                } catch (error) {
                    console.error("Errore nel parsing del JSON: ", error);
                    setTokenValid(false);
                }

            } catch (error) {
                console.error("Errore nella richiesta: ", error);
                setTokenValid(false);
            }
            /*if (!token) {
                setTokenValid(false);
                return;
            }

            try {
                const response = await fetch('https://test5.redweblab.it/reset-password.php', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-irlrncoded",
                    },
                    body: new URLSearchParams({
                        token: token,
                    })
                });

                const data = await response.json();
                console.log(data); //risposta dal server

                //Se il token è valido
                if (data.success) {
                    setTokenValid(true);
                } else {
                    setTokenValid(false);
                }
                //setTokenValid(data.success);
            } catch (error) {
                console.error(error); //aggiunto log di errore
                setTokenValid(false);
            }*/

        }

        /*  if (token) {
              checkToken();
          } else {
              setTokenValid(false);
          }*/
        //checkToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password) {
            setError("La nuova password è obbligatoria");
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await fetch('https://test5.redweblab.it/reset-password.php', {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    token: token,
                    password: password,
                }),
            });

            const data = await response.json();
            console.log(data); //Risposta completa


            if (data.success) {
                setSuccessMessage("Password aggiornata con successo");
                setOpenSnackbar(true);

                //redirigi alla pagina di login dopo un breve intervallo
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message); // Mostra il messaggio di errore restituito dal server
                setOpenSnackbar(true);
            }

        } catch (error) {
            setError("Errore durante il reset della password");
            setOpenSnackbar(true);
            console.error("error", error); // Aggiungi questa riga per vedere eventuali errori del fetch
        }
    }

    return (
        <Container component="main" maxWidth="xs" >

            <Box sx={{ marginTop: 10, marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight:"56vh" }}>
                <Typography color="white" component="h1" variant="h5">
                    Reset Password
                </Typography>

                {
                    !tokenValid ? (
                        <Typography color="error">Token non valido o scaduto. Per favore richiedi un nuovo link di reset.</Typography>
                    ) : (
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} >
                            {error && <Typography color="error">{error}</Typography>}
                            {successMessage && <Typography color="success">{successMessage}</Typography>}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Nuova password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputLabelProps={{
                                    style: { color: '#90caf9' },
                                }}
                                InputProps={{
                                    style: { color: '#ffffff' },
                                }}
                            />

                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, color:"whitesmoke" }}>
                                Salva la nuova password
                            </Button>

                        </Box>
                    )
                }
                {
                    console.log("Token valido: ", tokenValid) // Aggiungi un log per vedere se il valore viene impostato
                }

            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} message={error || successMessage} />
        </Container>
    )
}

export default ResetPasswordPage;   
