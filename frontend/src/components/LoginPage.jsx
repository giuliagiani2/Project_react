import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Snackbar, Link } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Controlla l'abbonamento dopo il login
  const verificaAbbonamento = async (utente_id) => {
    console.log("Verifica abbonamento per utente_id: ", utente_id);
    
    //Reindirizza sempre alla pagina AreaRiservata
    sessionStorage.setItem("isLoggedIn", true);
    sessionStorage.setItem("utente_id", utente_id);
    console.log("Reindiriziamo alla pagina riservata al cliente");
    navigate("/area-riservata");
  };

  // Funzione per inviare le credenziali al server
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Invio richiesta con: ", { email, password });

    try {
      const response = await fetch("https://test5.redweblab.it/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Risposta dal server: ", data);

      if (data.success) {
        console.log("Login riuscito, utente_id:", data.utente_id);

        //salviamo utente_id in local storage
        sessionStorage.setItem("utente_id", data.utente_id);
        sessionStorage.setItem("isLoggedIn", true);
        sessionStorage.setItem("role", data.role); // Salva il ruolo dell'utente

        console.log("Ruolo salvato: ", data.role ); 
        verificaAbbonamento(data.utente_id);
      } else {
        setErrorMessage(data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Errore generale durante il login:", error);
      setErrorMessage("Errore di connessione al server.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center", minHeight:"100vh" }}>
        <Typography component="h1" variant="h5" color="white">
          Login
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 5 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            InputLabelProps={{ style: { color: "#90caf9" } }}
            InputProps={{ style: { color: "#ffffff" } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            InputLabelProps={{ style: { color: "#90caf9" } }}
            InputProps={{ style: { color: "#ffffff" } }}
          />

          <Link component={RouterLink} to="/forgot-password" variant="body2">
            {"Hai dimenticato la password?"}
          </Link>
          <br />
          <Link component={RouterLink} to="/abbonamenti" variant="body2" > {/*nuovo link per la pagina abbonamenti*/}
            {"Vai agli abbonamenti"}
          </Link>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: 200 }}
          >
            Effettua l'accesso
          </Button>

          <Link component={RouterLink} to="/register" variant="body2">
            {"Non hai un account? Registrati"}
          </Link>
        </Box>
      </Box>

      {/* Snackbar per i messaggi di errore */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={errorMessage}
        sx={{ bottom: "20px" }}
      />
    </Container>
  );
};

export default LoginPage;
