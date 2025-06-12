import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Successo = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            //redirige automaticamente dopo 2 secondi
            navigate("/");
        }, 2000);
    }, [navigate]);

    return (
        <Box minHeight="100vh" sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
            <Typography variant="h4" align="center" color="whitesmoke">
                Pagamento avvenuto con successo!
            </Typography>
            <Typography variant="body1" align="center" color="whitesmoke">
                Grazie per il tuo acquisto.
            </Typography>
           
        </Box>
    );
}

export default Successo;