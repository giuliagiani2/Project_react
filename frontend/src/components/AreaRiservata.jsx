import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container, Snackbar, Tab, Tabs, TextField, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";

const AreaRiservata = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [abbonamentoAttivo, setAbbonamentoAttivo] = useState(false);
  const [corsiIscritti, setCorsiIscritti] = useState([]);
  const [progressi, setProgressi] = useState([]);

  const navigate = useNavigate();

  //recupero del token e dell'utente_id dalla sessione
  useEffect(() => {
    const utente_id = sessionStorage.getItem("utente_id");
    const token = localStorage.getItem("authtoken");

    if (!utente_id && !token) {
      navigate("/login");
      return;
    }

    //Prendiamo i dati dell'utente dal database
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://test5.redweblab.it/get_utente.php?utente_id=${utente_id}`);
        const data = await response.json();

        if (data.success && data.data) {
          setUserData(data.data);
          sessionStorage.setItem("nome", data.data.nome);
          sessionStorage.setItem("cognome", data.data.cognome);
          sessionStorage.setItem("email", data.data.email);
          sessionStorage.setItem("telefono", data.data.telefono);
          sessionStorage.setItem("indirizzo", data.data.indirizzo);
          sessionStorage.setItem("p_iva", data.data.p_iva);
          sessionStorage.setItem("cf", data.data.cf);
        } else {
          throw new Error("Errore nel caricamento dei dati");
        }
      } catch (error) {
        setError(error.message);
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    //Verifichiamo la validità dell'abbonamento
    const verificaAbbonamento = async (utente_id) => {
      try {
        const response = await fetch(`https://test5.redweblab.it/verifica_abbonamento.php?utente_id=${utente_id}`);
        const data = await response.json();

        if (data.attivo) {
          setAbbonamentoAttivo(true);
        } else {
          setAbbonamentoAttivo(false);
        }
      } catch (error) {
        console.error("Errore nel controllo abbonamento: ", error);
        setError("Errore nella verifica dell'abbonamento.");
        setOpenSnackbar(true);
      }
    };

    //Ordine di esecuzione delle funzioni
    const loadData = async () => {
      setLoading(true);
      await fetchUserData();
      await verificaAbbonamento(utente_id);
      await fetchCorsiIscritti();
      await fetchProgressi();
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  //Aggiornamento delle informazioni dell'utente
  const handleUpdateUser = async () => {
    const utente_id = sessionStorage.getItem("utente_id");

    if (!utente_id) {
      setError("ID utente mancante");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch("https://test5.redweblab.it/update_utente.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          utente_id: utente_id,
          nome: userData.nome,
          cognome: userData.cognome,
          email: userData.email,
          telefono: userData.telefono,
          indirizzo: userData.indirizzo,
          p_iva: userData.p_iva,
          cf: userData.cf
        })
      });

      const responseText = await response.text();

      try {
        const data = JSON.parse(responseText);

        if (data && data.success) {
          setSuccessMessage("Dati aggiornati con successo!");
          setOpenSnackbar(true);
          sessionStorage.setItem("nome", userData.nome);
          sessionStorage.setItem("cognome", userData.cognome);
          sessionStorage.setItem("email", userData.email);
          sessionStorage.setItem("telefono", userData.telefono);
          sessionStorage.setItem("indirizzo", userData.indirizzo);
          sessionStorage.setItem("p_iva", userData.p_iva);
          sessionStorage.setItem("cf", userData.cf);

          await verificaAbbonamento(sessionStorage.getItem("utente_id"));
        } else {
          throw new Error(data?.message || "Errore sconosciuto");
        }
      } catch (jsonError) {
        setError("Errore del server, riprova più tardi.");
        setOpenSnackbar(true);
      }

    } catch (error) {
      setError("Errore nell'aggiornamento: " + error.message);
      setOpenSnackbar(true);
    }
  };

  //Funzione per recuperare i corsi iscritti dai vari utenti
  /*const fetchCorsiIscritti = async () => {
    const utente_id = sessionStorage.getItem("utente_id");

    try {
      const response = await fetch(`https://test5.redweblab.it/get_corsi_iscritti.php?utente_id=${utente_id}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.corsi)) {
        setCorsiIscritti(data.corsi);
      } else {
        setCorsiIscritti([]);
      }
    } catch (error) {
      console.error("Errore nel recupero dei corsi iscritti: ", error);
      setError("Impossibile caricare i corsi iscritti.");
      setOpenSnackbar(true);
    }
  } */

  //recupero dei progressi per ogni corso
  /*const fetchProgressi = async () => {
    const utente_id = sessionStorage.getItem("utente_id");

    try {
      const response = await fetch(`https://test5.redweblab.it/get_progressi.php?utente_id=${utente_id}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.progressi)) {
        setProgressi(data.progressi);
      } else {
        setProgressi({});
      }

    } catch (error) {
      console.error("Errore nel recupero dei progressi: ", error);
      setError("Impossibile caricare i progressi");
      setOpenSnackbar(true);
    }
  }*/

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
    sessionStorage.setItem(name, value);
  };

  //Funzione per effettuare il rinnovo dell'abbonamento dopo la scadenza
  const handleRinnovoAbb = () => {
    if (abbonamentoAttivo) {
      const scadenza = new Date(userData.scadenza);
      const oggi = new Date();

      if (scadenza > oggi) {
        alert("Puoi rinnovare l'abbonamento solo dopo la scadenza");
        return;
      }
    }
    setSuccessMessage("Stai per rinnovare l'abbonamento");
    setOpenSnackbar(true);
    navigate("/abbonamenti");
  };

  //Funzione di logout
  const handleLogout = () => {
    if (window.confirm(`Il tuo abbonamento è attivo fino al: ${userData?.scadenza || "illimitato" || ""}.
Vuoi davvero uscire?`)) {
      sessionStorage.removeItem("utente_id");
      localStorage.removeItem("authtoken")
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 10, textAlign: "center" }}>
          <Typography variant="h6">Caricamento in corso dei dati...</Typography>
        </Box>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 10, textAlign: "center" }}>
          <Typography variant="h6">Errore nel caricamento dei dati</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box
        sx={{
          height: { sx: "auto", md: "88vh" },
          borderRight: "1px solid #3d3d3d",
          px: { sx: 0, md: 2 },
        }}
      >
        <SideBar
          selectedCategory="Informazioni"
          setSelectedCategory={(category) => {
            if (category === "Tutti i corsi") {
              navigate("/");
            } else if (category === "Corsi in evidenza") {
              navigate("/search/Corsi in evidenza");
            } else if (category === "Per relatore") {
              navigate("/search/Per relatore");
            } else if (category === "Informazioni") {
              navigate("/area-riservata");
            }
          }}
        />
      </Box>

      <Container component="main" maxWidth="md" sx={{ minHeight: "100vh", padding: 2, backgroundColor: "#121212", color: "white" }}>
        <Tabs value={tabIndex}
          onChange={handleChangeTab}
          centered
          textColor="inherit"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": { color: "#b0bec5", transition: "color 0.3s" },
            "& .Mui-selected": { color: "#efc064" },
            "& .MuiTab-root:hover": { color: "#efc064", transform: "scale(1.1)", transition: "transform 0.2s ease" }
          }}
        >
          <Tab label="Informazioni Utente" />
          <Tab label="Impostazioni" />
          <Tab label="Corsi iscritti" />
        </Tabs>

        {tabIndex === 0 && (
          <Box sx={{ textAlign: "center", padding: 3 }}>
            <Typography variant="h4">Benvenuto/a {userData.nome} {userData.cognome}!</Typography>
            <Typography>Email: {userData.email}</Typography>
            <Typography>Telefono: {userData.telefono || "Non fornito"}</Typography>
            <Typography>Indirizzo: {userData.indirizzo || "Non fornito"}</Typography>
            <Typography>P. IVA: {userData.p_iva || "Non fornita"}</Typography>
            <Typography>Codice Fiscale: {userData.cf || "Non fornito"}</Typography>
            <Typography sx={{ fontWeight: "bold", marginTop: 2 }}>Abbonamento attivo fino al: {userData.scadenza ? userData.scadenza : "Nessun abbonamento attivo"}</Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 3 }}>

              {abbonamentoAttivo ? (
                <Button variant="contained" color="primary" onClick={handleRinnovoAbb}
                  sx={{
                    backgroundColor: "#efc064", "&:hover": {
                      backgroundColor: "#d4a30a"
                    }
                  }}
                >
                  Rinnova abbonamento
                </Button>
              ) : (
                <Button variant="contained" color="secondary" onClick={handleRinnovoAbb}
                  sx={{
                    backgroundColor: "#e91e63", "&:hover": {
                      backgroundColor: "#c2185b"
                    }
                  }}
                >
                  Acquista abbonamento
                </Button>
              )}

              <Button variant="outlined" color="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h5">Modifica le tue informazioni</Typography>
            <TextField fullWidth margin="normal" label="Nome" name="nome" value={userData.nome || ""} onChange={handleChange} sx={{ input: { color: "white", backgroundColor: "#333", borderRadius: 1 }, label: { color: "#90caf9" } }} />
            <TextField fullWidth margin="normal" label="Cognome" name="cognome" value={userData.cognome || ""} onChange={handleChange} sx={{ input: { color: "white" }, label: { color: "#90caf9" } }} />
            <TextField fullWidth margin="normal" label="Email" name="email" value={userData.email || ""} onChange={handleChange} sx={{ input: { color: "white" }, label: { color: "#90caf9" } }} />
            <TextField fullWidth margin="normal" label="Telefono" name="telefono" value={userData.telefono || ""} onChange={handleChange} sx={{ input: { color: "white" }, label: { color: "#90caf9" } }} />
            <TextField fullWidth margin="normal" label="Indirizzo" name="indirizzo" value={userData.indirizzo || ""} onChange={handleChange} sx={{ input: { color: "white" }, label: { color: "#90caf9" } }} />
            <TextField fullWidth margin="normal" label="P. IVA" name="p_iva" value={userData.p_iva || ""} onChange={handleChange} sx={{ input: { color: "white" }, label: { color: "#90caf9" } }} />
            <TextField fullWidth margin="normal" label="Codice Fiscale" name="cf" value={userData.cf || ""} onChange={handleChange} sx={{ input: { color: "white" }, label: { color: "#90caf9" } }} />
            <Button variant="contained" color="primary" onClick={handleUpdateUser}>Salva modifiche</Button>
          </Box>
        )}

        {tabIndex === 2 && (
          <Box sx={{ padding: 3 }}>
            <Typography>Corsi a cui sei iscritto</Typography>
            {corsiIscritti.length > 0 ? (
              <ul>
                {corsiIscritti.map((corso) => (
                  <li key={corso.id}>
                    <Typography variant="body1" color="white">{corso.titolo}</Typography>
                    <Typography variant="body2" color="grey"> Progresso</Typography>
                    <LinearProgress variant="determinate" value={progressi[corso.id] || 0} />
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body1" color="gray">Non sei iscritto a nessun corso</Typography>
            )}
          </Box>
        )}

        <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} message={error || successMessage} />
      </Container>
    </Box>
  );
};

export default AreaRiservata;
