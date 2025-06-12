import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Box, Stack, Container, LinearProgress, Button } from "@mui/material";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { serverUrl } from "../utils/constants";

const VideoDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoNode = useRef(null);
  const player = useRef(null);
  const [progress, setProgress] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState(() => {
    const saved = localStorage.getItem("watchedVideos");
    return saved ? JSON.parse(saved) : {};
  });

  const video = location.state?.video;

  const handleSaveProgress = async (progress) => {
    const utente_id = sessionStorage.getItem("utente_id");
    const corso_id = video.courseId;
    const video_id = video.videoId;

    if (!utente_id || !corso_id || !video_id) {
      console.error("Dati mancanti per salvare il progresso");
      return;
    }

    try {
      const response = await fetch("https://test5.redweblab.it/salva_progresso.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utente_id, corso_id, video_id, progresso: progress }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Errore durante il salvataggio del progresso:", data.message);
      }
    } catch (error) {
      console.error("Errore di connessione al server:", error);
    }
  };

  useEffect(() => {
    if (video && videoNode.current) {
      // Distruggi il player precedente
      if (player.current) {
        player.current.dispose();
      }

      // Inizializza un nuovo player
      player.current = videojs(videoNode.current, {
        controls: true,
        fluid: true,
        preload: "auto",
      });

      // Eventi del player
      player.current.on("timeupdate", () => {
        const currentTime = player.current.currentTime();
        const duration = player.current.duration();
        if (duration) {
          const progress = Math.round((currentTime / duration) * 100);
          setProgress(progress);

          // Salva il progresso ogni 10% completato
          if (progress % 10 === 0) {
            handleSaveProgress(progress);
          }
        }
      });

      player.current.on("ended", () => {
        setWatchedVideos((prev) => ({
          ...prev,
          [video.videoId]: true,
        }));
        localStorage.setItem("watchedVideos", JSON.stringify({ ...watchedVideos, [video.videoId]: true }));

        // Salva il progresso come completato (100%)
        handleSaveProgress(100);
      });
    }

    // Cleanup del player
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, [video]);

  if (!video) {
    return <Typography variant="h6" color="white">Video non trovato</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box minHeight="85vh" py={4}>
        <Box mb={2}>
          <Typography variant="body2" color="#fff">
            Progresso: {progress}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Stack direction={{ xs: "column", md: "row" }}>
          <Box flex={1}>
            <div data-vjs-player>
              <video ref={videoNode} className="video-js vjs-big-play-centered" poster={`${serverUrl}${video.image}`} />
            </div>
            <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
              {video.title}
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff" }} pl={2} pr={2}>
              {video.description}
            </Typography>
          </Box>
          <Box px={2} py={{ md: 1, xs: 5 }}>
            <Typography variant="h6" color="white" mb={2}>
              Altri video
            </Typography>
            {video.relatedVideos?.map((relatedVideo) => (
              <Box key={relatedVideo.videoId} mb={2}>
                <Typography variant="body2" color="white">
                  {relatedVideo.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{ mt: 3 }}
        >
          Torna indietro
        </Button>
      </Box>
    </Container>
  );
};

export default VideoDetails;
