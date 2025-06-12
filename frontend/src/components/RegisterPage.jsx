// components/RegisterPage.js
import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Snackbar, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formValues, setFormValue] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    indirizzo: "",
    p_iva: "",
    cf: ""
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, surname, email, password, confirmPassword, telefono, indirizzo, p_iva, cf } = formValues;

    console.log("Valori inseriti", formValues);


    //Validazione semplice
    if (!name || !surname || !email || !password || !confirmPassword) {
      setError("Inserire tutti i campi obbligatori");
      setOpenSnackbar(true);
      return;
    }

    //Controllo della lunghezza della password
    if (password.length < 8) {
      setError("La password deve essere lunga almeno 8 caratteri");
      setOpenSnackbar(true);
      return;
    }

    //Confronto tra la passwrod inserita e la conferma della password
    if (password !== confirmPassword) {
      setError("Le password devono coincidere");
      setOpenSnackbar(true);
      return;
    }

    //controllo per l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("inserisci un'email valida.");
      setOpenSnackbar(true);
      return;
    }

    //Controllo per il telefono
    if (telefono && !/^\d+$/.test(telefono)) {
      setError("Il telefono deve contenero solo numeri");
      setOpenSnackbar(true);
      return;
    }


    //costruzione dei dati da inviare al server
    const userData = {
      name,
      surname,
      email,
      password,
      telefono,
      indirizzo,
      p_iva,
      cf,
      data_registrazione: new Date().toISOString(), //Invia la data in formato ISO
    };

    try {
      //invio richiesta al server PHP
      const response = await fetch("https://test5.redweblab.it/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(userData).toString(),
      });

      if (!response.ok) {
        alert("Errore di connessione con il server");
        console.error("Errore nella risposta del server: ", response); // Log dell'errore se la risposta non è ok
        setError("Errore di connessione al server.");
        setOpenSnackbar(true);
        return;
      }

      const data = await response.json();
      console.log("Risposta dal server", data);


      if (data.success) {
        setSuccessMessage("Registrazione completata! Puoi effettuare il login.");
        setOpenSnackbar(true);

        setError("");
        //Salva il messaggio di successo in localStorage
        localStorage.setItem("registerSuccess", "Registrazione avvenuta con successo. Ora puoi fare il login")

        setTimeout(() => {
          navigate("/login"); //dopo la registrazione si va alla pagina di login
        }, 1500);
      } else {
        setError(data.message); //mostra il messaggio di errore dal backend
        setOpenSnackbar(true);
      }

    } catch (error) {
      setError("Si è verificato un errore durante la registrazione");
      setOpenSnackbar(true);
    }
    console.log("Valori dentro userData: ", userData);

  }


  return (
    <Container component="main" maxWidth="md" className="register-container" sx={{ padding: 3, backgroundColor: "#121212", color: "white" }}>
      <Box
        sx={{
          marginTop: 10,
          marginBottom: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5" align="center" sx={{ marginBottom: 2 }}>
          Register
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 5, mb: 10 }}>
          <Grid container spacing={2}> {/* Grid container per organizzare i campi */}
            <Grid item xs={12} sm={6}> {/* Nome e cognome sulla stessa riga */}
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: '#90caf9' } }}
                InputProps={{ style: { color: '#ffffff' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cognome"
                name="surname"
                value={formValues.surname}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: '#90caf9' } }}
                InputProps={{ style: { color: '#ffffff' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}> {/* Email e password sulla stessa riga */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: '#90caf9' } }}
                InputProps={{ style: { color: '#ffffff' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: '#90caf9' } }}
                InputProps={{ style: { color: '#ffffff' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}> {/* Conferma password e telefono sulla stessa riga */}
              <TextField
                fullWidth
                label="Conferma password"
                name="confirmPassword"
                type="password"
                value={formValues.confirmPassword}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: '#90caf9' } }}
                InputProps={{ style: { color: '#ffffff' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefono"
                name="telefono"
                value={formValues.telefono}
                onChange={handleChange}
                InputLabelProps={{ style: { color: '#90caf9' } }}
                InputProps={{ style: { color: '#ffffff' } }}
              />
            </Grid>

            <Grid item xs={12}> {/* Indirizzo su una riga intera */}
              <TextField
                fullWidth
                label="Indirizzo"
                name="indirizzo"
                value={formValues.indirizzo}
                onChange={handleChange}
                InputLabelProps={{ style: { color: '#90caf9' } }}
                InputProps={{ style: { color: '#ffffff' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}> {/* P. IVA e CF sulla stessa riga */}
              <TextField
                fullWidth
                required
                label="P. IVA"
                name="p_iva"
                value={formValues.p_iva}
                onChange={handleChange}
                InputLabelProps={{ style: { color: '#90caf9' } }}
                InputProps={{ style: { color: '#ffffff' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
              required
                fullWidth
                label="Codice Fiscale"
                name="cf"
                value={formValues.cf}
                onChange={handleChange}
                InputLabelProps={{ style: { color: '#90caf9' } }}
                InputProps={{ style: { color: '#ffffff' } }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: 200 }}
          >
            Registrati
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={error || successMessage}
        sx={{ bottom: "20px" }}
      />
    </Container>
  );
};

export default RegisterPage;
