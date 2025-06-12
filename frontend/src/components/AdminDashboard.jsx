import React, { useState } from "react";
import { Box, Typography, Button, Container, Tabs, Tab, TextField, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import SideBar from "./SideBar";

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate(); // Definisci navigate

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setFormData({}); // Resetta i dati del form quando si cambia tab
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (endpoint) => {
    try {
      const response = await fetch(`https://test5.redweblab.it/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setSnackbarMessage(data.message || "Operazione completata");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Errore durante l'invio:", error);
      setSnackbarMessage("Errore durante l'invio dei dati");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          height: { sx: "auto", md: "88vh" },
          borderRight: "1px solid #3d3d3d",
          px: { sx: 0, md: 2 },
        }}
      >
        <SideBar
          selectedCategory="Admin"
          setSelectedCategory={(category) => {
            if (category === "Tutti i corsi") {
              navigate("/"); // Naviga alla pagina principale
            } else if (category === "Corsi in evidenza") {
              navigate("/search/Corsi in evidenza"); // Naviga ai corsi in evidenza
            } else if (category === "Per relatore") {
              navigate("/search/Per relatore"); // Naviga ai corsi per relatore
            } else if (category === "Admin") {
              navigate("/admin"); // Rimani nel pannello admin
            }
          }}
        />
      </Box>

      {/* Main Content */}
      <Container
        component="main"
        maxWidth="md"
        sx={{ minHeight: "100vh", padding: 2, backgroundColor: "#121212", color: "white" }}
      >
        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          textColor="inherit"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": { color: "#b0bec5", transition: "color 0.3s" },
            "& .Mui-selected": { color: "#efc064" },
            "& .MuiTab-root:hover": { color: "#efc064", transform: "scale(1.1)", transition: "transform 0.2s ease" },
          }}
        >
          <Tab label="Gestione Video" />
          <Tab label="Gestione Corsi" />
          <Tab label="Gestione Canali" />
        </Tabs>

        {/* Tab Content */}
        {tabIndex === 0 && (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h5" mb={2}>
              Gestione Video
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Titolo"
              name="titolo"
              value={formData.titolo || ""}
              onChange={handleInputChange}
              sx={{ input: { color: "white" }, label: { color: "#90caf9" } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Descrizione"
              name="descrizione"
              value={formData.descrizione || ""}
              onChange={handleInputChange}
              sx={{ input: { color: "white" }, label: { color: "#90caf9" } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="URL Video"
              name="url_video"
              value={formData.url_video || ""}
              onChange={handleInputChange}
              sx={{ input: { color: "white" }, label: { color: "#90caf9" } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Immagine"
              name="immagine"
              value={formData.immagine || ""}
              onChange={handleInputChange}
              sx={{ input: { color: "white" }, label: { color: "#90caf9" } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="ID Corso"
              name="id_corso"
              value={formData.id_corso || ""}
              onChange={handleInputChange}
              sx={{ input: { color: "white" }, label: { color: "#90caf9" } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit("add_video.php")}
            >
              Carica Video
            </Button>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h5" mb={2}>
              Gestione Corsi
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Titolo"
              name="titolo"
              value={formData.titolo || ""}
              onChange={handleInputChange}
              sx={{ input: { color: "white" }, label: { color: "#90caf9" } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Descrizione"
              name="descrizione"
              value={formData.descrizione || ""}
              onChange={handleInputChange}
              sx={{ input: { color: "white" }, label: { color: "#90caf9" } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="ID Canale"
              name="id_canale"
              value={formData.id_canale || ""}
              onChange={handleInputChange}
              sx={{ input: { color: "white" }, label: { color: "#90caf9" } }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleSubmit("add_corso.php")}
            >
              Aggiungi Corso
            </Button>
          </Box>
        )}

        {tabIndex === 2 && (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h5" mb={2}>
              Gestione Canali
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Titolo"
              name="titolo"
              value={formData.titolo || ""}
              onChange={handleInputChange}
              sx={{ input: { color: "white" }, label: { color: "#90caf9" } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Descrizione"
              name="descrizione"
              value={formData.descrizione || ""}
              onChange={handleInputChange}
              sx={{ input: { color: "white" }, label: { color: "#90caf9" } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Immagine"
              name="immagine"
              value={formData.immagine || ""}
              onChange={handleInputChange}
              sx={{ input: { color: "white" }, label: { color: "#90caf9" } }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={() => handleSubmit("add_canale.php")}
            >
              Aggiungi Canale
            </Button>
          </Box>
        )}
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AdminDashboard;
