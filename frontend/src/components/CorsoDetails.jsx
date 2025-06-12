import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Stack, Button, Container, Link } from '@mui/material';
import { Loader } from './';
import { serverUrl } from '../utils/constants';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';

const CorsoDetails = ({ videos = [] }) => { // Imposta un valore predefinito per videos
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [progress, setProgress] = useState(0); // Stato per la percentuale di completamento
  const [watchedVideos, setWatchedVideos] = useState(() => {
    const saved = localStorage.getItem('watchedVideosByCourse');
    return saved ? JSON.parse(saved) : {};
  });

  const [userRating, setUserRating] = useState(0);

  const courseId = selectedVideo?.courseId; // Assumiamo che `courseId` sia presente nei dati del corso

  useEffect(() => {
    if (location.state?.video) {
      setSelectedVideo(location.state.video);
    }
  }, [location.state]);

  const calculateProgress = () => {
    if (!selectedVideo || !selectedVideo.corso) {
      return 0; // Ritorna 0 se selectedVideo o corso non sono disponibili
    }
    const courseVideos = selectedVideo.corso;
    const watchedForCourse = watchedVideos[selectedVideo.courseId] || {};
    const watchedCount = courseVideos.filter((video) => watchedForCourse[`${selectedVideo.courseId}-${video.videoId}`]).length; // Conta solo i video completati
    return courseVideos.length > 0 ? (watchedCount / courseVideos.length) * 100 : 0;
  };

  useEffect(() => {
    setProgress(calculateProgress());
  }, [watchedVideos, selectedVideo]);

  const handleRatingStar = async (event, newValue) => {
    setUserRating(newValue);

    const utente_id = sessionStorage.getItem("utente_id");
    const corso_id = courseId;

    console.log("utente_id:", utente_id);
    console.log("corso_id:", corso_id);
    console.log("valutazione:", newValue);

    if (!utente_id || !corso_id) {
      alert("Errore: dati mancanti per salvare la valutazione.");
      return;
    }

    try {
      const response = await fetch("https://test5.redweblab.it/salva_valutazione.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utente_id, corso_id, valutazione: newValue }),
      });

      const data = await response.json();
      console.log("Risposta dal server:", data);

      if (data.success) {
        alert("Valutazione salvata con successo!");
      } else {
        console.error("Errore durante il salvataggio della valutazione:", data.message);
        alert(`Errore durante il salvataggio della valutazione: ${data.message}`);
      }
    } catch (error) {
      console.error("Errore durante il salvataggio della valutazione:", error);
      alert("Errore di connessione al server.");
    }
  };

  //recupero della valutazione dal sessionStorage
  useEffect(() => {
    const savedRatings = JSON.parse(sessionStorage.getItem('ratings')) || {};
    if (savedRatings[courseId]) {
      setUserRating(savedRatings[courseId]);
    }
  }, [courseId]);

  useEffect(() => {
    const fetchValutazione = async () => {
      const utente_id = sessionStorage.getItem("utente_id");
      const corso_id = courseId;

      if (!utente_id || !corso_id) return;

      try {
        const response = await fetch(`https://test5.redweblab.it/get_valutazione.php?utente_id=${utente_id}&corso_id=${corso_id}`);
        const data = await response.json();

        if (data.success && data.valutazione) {
          setUserRating(data.valutazione);
          sessionStorage.setItem("ratings", JSON.stringify({ ...JSON.parse(sessionStorage.getItem("ratings") || "{}"), [corso_id]: data.valutazione }));
        }
      } catch (error) {
        console.error("Errore nel recupero della valutazione:", error);
      }
    };

    fetchValutazione();
  }, [courseId]);

  const handleIscrizioneCorso = async () => {
    const utente_id = sessionStorage.getItem("utente_id");
    const corso_id = selectedVideo?.courseId;

    if (!utente_id) {
        alert("Devi effettuare il login prima di iscriverti a un corso");
        navigate("/login");
        return;
    }

    if (!corso_id) {
        alert("Errore: corso_id non valido.");
        return;
    }

    try {
        const response = await fetch("https://test5.redweblab.it/iscrizione_corso.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ utente_id, corso_id }),
        });

        const data = await response.json();

        if (data.success) {
            alert("Iscrizione completata con successo");
        } else {
            alert(data.message); // Mostra il messaggio di errore dal backend
        }
    } catch (error) {
        console.error("Errore durante l'iscrizione:", error);
        alert("Errore di connessione al server");
    }
  };

  // Quando si clicca su "Inizia il corso", naviga alla pagina con il video e la playlist
  const handleGoToFirstCourseVideo = () => {
    if (selectedVideo && selectedVideo.corso && selectedVideo.corso.length > 0) {
      const updatedVideos = selectedVideo.corso.map(video => ({
        ...video,
        courseId: selectedVideo.courseId, // Aggiungi il courseId a ogni video
      }));
      navigate(`/video/${updatedVideos[0].videoId}`, {
        state: {
          video: updatedVideos[0],
          allVideo: updatedVideos,
          courseId: selectedVideo.courseId, // Passa courseId nello stato
        },
      });
    }
  };

  if (!selectedVideo) {
    return <Loader />;
  }

  const { title, description, channel, corso } = selectedVideo; // Rimosso videoId

  return (
    <Container maxWidth="lg">
      <Box minHeight="85vh" py={4}>
        <Stack direction={{ xs: 'column', md: 'row' }}>
          <Box flex={1}>
            <Box sx={{ width: '100%', position: 'sticky', top: '86px' }}>
              <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
                Introduzione al corso {title}
              </Typography>
              <Typography variant="body1" sx={{ color: '#fff' }} pl={2} pr={2}>
                {description}
              </Typography>

              {/* Video principale */}
              <Box px={2} py={3}>
                <video controls width="100%">
                  <source src={`${serverUrl}${corso[0]?.url}`} type="video/mp4" />
                  Il tuo browser non supporta il tag video.
                </video>
              </Box>

              {/* Bottone per iniziare il corso */}
              <Box>
                <Button sx={{ backgroundColor: "gold", color: "white", "&:hover": { backgroundColor: "lightgoldenrodyellow", color: "grey" } }} variant="contained" color="primary" onClick={handleGoToFirstCourseVideo}>
                  Inizia il corso
                </Button>
              </Box>

              {/**Bottone per iscriversi al corso */}
              <Box sx={{py:5}}>
                <Button sx={{ backgroundColor: "gold", color: "white", "&:hover": { backgroundColor: "lightgoldenrodyellow", color: "grey" } }} variant='contained' color='primary' onClick={handleIscrizioneCorso}>
                  Iscriviti al corso
                </Button>
              </Box>

              {/* Riepilogo del canale */}
              <Box >
                <Typography variant="h6">Pubblicato da: {selectedVideo.channel.title}</Typography>
                <Typography variant="body2">Iscritti: {selectedVideo.channel.statistics.subscriberCount}</Typography>
                <Button
                  sx={{
                    backgroundColor: "gold",
                    color: "white",
                    "&:hover": { backgroundColor: "lightgoldenrodyellow", color: "grey" },
                  }}
                  onClick={() =>
                    navigate(`/channel/${selectedVideo.channel.channelId}`, {
                      state: {
                        channel: selectedVideo.channel,
                        videos: videos.filter(
                          (video) => video.channel?.channelId === selectedVideo.channel.channelId
                        ), // Passa tutti i video del canale
                      },
                    })
                  }
                >
                  Visita il Canale
                </Button>
              </Box>

              {/* Barra di completamento */}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4} sm={3} md={2} xl={1.8}>
                  <Typography color="#fff" variant="h6" fontWeight="bold" px={2} pt={.5}>
                    Completamento
                  </Typography>
                </Grid>
                <Grid item xs={8} sm={2} md={6} xl={6}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <Box pb={5} px={1.2} pt={1.2}>
                      <CircularProgress
                        sx={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "goldenrod" }}
                        value={progress} // Utilizza il progresso dinamico
                        color="error"
                        variant="determinate"
                      />
                      <Typography variant="caption" component="div" color="white">{`${Math.round(progress)}%`}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={7} sm={3} md={2} xl={2}>
                  {channel && (
                    <Stack direction="row" justifyContent="space-between" sx={{ color: '#fff' }} pb={1} px={2}>
                      <Typography variant="subtitle1" color="#fff">
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none", color: "gold" }}
                          component={RouterLink}
                          to={`/channel/${selectedVideo.channel.channelId}`}
                          state={{
                            channel: selectedVideo.channel,
                            videos: videos.filter(
                              (video) => video.channel?.channelId === selectedVideo.channel.channelId
                            ),
                          }}
                        >
                          {channel.title}
                        </Link>
                        <CheckCircleIcon sx={{ fontSize: "14px", color: "gray", ml: "5px" }} />
                      </Typography>
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={5} sm={3} md={2} xl={2}>
                  <Box pb={5} px={2}>
                    <Rating
                      name="read-only"
                      value={userRating}
                      onChange={handleRatingStar}
                      precision={0.5}
                      emptyIcon={<StarIcon style={{ opacity: 0.55, color: "#fff" }} fontSize="inherit" />}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Altri corsi dello stesso canale */}
              <Box>
                <Typography variant="h6" sx={{ mt: 4 }}>Altri corsi di {selectedVideo.channel.title}:</Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  {videos
                    .filter((video) => video.channel?.channelId === selectedVideo.channel.channelId && video.courseId !== selectedVideo.courseId)
                    .map((video) => (
                      <Box key={video.courseId}>
                        <Typography variant="body2" color="white">{video.title}</Typography>
                      </Box>
                    ))}
                </Stack>
              </Box>

            </Box>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default CorsoDetails;
