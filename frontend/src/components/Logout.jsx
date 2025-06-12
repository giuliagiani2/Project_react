import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, Typography, Snackbar } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Logout = () => {
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false); // Stato per gestire l'apertura del toast
    const [isAuthenticated, setIsAuthenticated] = useState(false) // Stato per la verifica dell'autenticazione

    // Verifica se l'utente è loggato (controllando se il token è presente)
    useEffect(() => {
        const token = localStorage.getItem('authtoken');
        if (token) {
            setIsAuthenticated(true); //l'utente già loggato
        } else {
            setIsAuthenticated(false); //l'utente non è loggato
        }
    }, []);

    //Funzione per rimuovere i cookie
    const removeCookie=()=>{
        document.cookie = "user_id=; path=/; max-age=0";
        document.cookie = "user_email=; path=/; max-age=0";
        document.cookie = "token=; path=/; max-age=0";
    }

    //funzione per gestire il logout
    const handleLogout = async () => {
        //verifica se l'utente è loggato 
        const token = localStorage.getItem('authtoken');
        if (!token) {
            //se non esiste un token, reindirizza alla pagina di login
            navigate("/login");
            return;  // Esce dalla funzione, impedendo l'esecuzione del logout
        }


        try {
            //chiamata al backend per distruggere la sessione (se encessario)
            const response = await fetch('https://test5.redweblab.it/logout.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const data = await response.json();

            if (data.success) {
                //rimuovi il token dal localStorage
                localStorage.removeItem('authtoken');
                console.log("Effettuato logout");

                //Rimozione dei cookie
                removeCookie();

                // Mostra il messaggio di successo tramite Snackbar
                setOpenSnackbar(true);

                //reindirizza l'utente alla pagina di login dopo il messaggio
                setTimeout(() => {
                    navigate('/login');
                }, 1500); //dopo 1,5 secondi avviene il reindirizzamento

            } else {
                console.error("Errore durante il logout");
            }
        } catch (error) {
            console.error("Errore di connessione", error);
        }
    };

    return (
        <div>
            {/*Mostra il bottone di logout solo se l'utente è loggato */}
            {isAuthenticated && (

                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ExitToAppIcon />} //aggiunta icona di logout
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 30,
                        padding: "6px 20px",
                        textTransform: "none",
                        fontWeight: "16px",
                        "&:hover": {
                            backgroundColor: "#f50057", //colore al passaggiod el mouse
                            color: "#fff",
                        },
                    }}
                >
                    <Typography variant="button" sx={{ fontWeight: 'bold' }}>
                        Logout
                    </Typography>
                </Button>
            )}

            {/*Snackbar per mostrare il messaggio di successo */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000} //Durata del messaggio
                onClose={() => setOpenSnackbar(false)}
                message="Logout effettuato con successo!" //Messaggio di successo
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Posizione del toast
            />

        </div>
    );

}

export default Logout;