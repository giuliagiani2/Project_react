import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
    { question: "Come posso registrarmi al sito?", answer: "Per registrarti devi schiacciare l'icona con su l'omino e schiaccare la frase 'Non hai ancora un account? Registrati'." },
    { question: "Come posso accedere alla mia area riservata?", answer: "Dopo la registrazione, accedi alla pagina di login, inserisci le credenziali e verrai reindirizzato alla tua area riservata." },
    { question: "Come posso acquistare un abbonamento?", answer: "L'abbonamento lo puoi acquistare direttamente nella tua area riservata nella sezione 'Informazioni utente'." },
    { question: "Quando posso iniziare a guardare i video?", answer: "Dopo che hai acquistato un abbonamento attivo, puoi accedere ai video e interaggire con essi." },
    { question: "Cosa succede se il mio abbonamento scade?", answer: "Se il tuo abbonamento scade, non potrai più visualizzare i video finchè non lo rinnoverai." },
    { question: "Posso modificare i miei dati personali?", answer: "Si, puoi modificare le tue informazioni o aggiungerle direttamente dalla tua area riservata nella sezione 'Impostazioni'. " }
];

const FAQPage = () => {
    return (
        <Box p={2} sx={{ maxWidth: "800px", margin: "auto", color: "white" }}>
            <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
                Domande più frequenti
            </Typography>
            {
                faqs.map((faq, index) => (
                    <Accordion key={index} sx={{ backgroundColor: "#222", color: "white", marginBottom: "8px" }} >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                            sx={{ backgroundColor: "#333" }}
                        >
                            <Typography>{faq.question}</Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Typography>{faq.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </Box>
    );
};

export default FAQPage;