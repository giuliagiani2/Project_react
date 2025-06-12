import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Typography, Card, CardContent, CardMedia, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { serverUrl } from "../utils/constants.js";

const VideoCard = ({ video, videos = [] }) => { // Aggiungi un valore predefinito per videos
  const navigate = useNavigate();

  // Controlla se i dati sono definiti
  if (!video || !video.channel) {
    console.error("Video o channel non definito:", video);
    return (
      <Box>
        <Typography variant="body2" color="gray">
          Dati del video non disponibili.
        </Typography>
      </Box>
    );
  }

  const { videoId, image, channel, title, description } = video;

  const handleClick = () => {
    navigate(`/corso/${videoId}`, { state: { video } });
  };

  return (
    <Box>
      <Card
        sx={{
          width: { xs: "100%", sm: "358px" },
          boxShadow: "none",
          borderRadius: 0,
          maxWidth: "358px",
        }}
      >
        <Box onClick={handleClick}>
          <CardMedia
            component="img"
            image={serverUrl + image || "/images/default.jpg"}
            alt={title || "Video"}
            sx={{
              width: { xs: "100%", sm: "358px", md: "320px" },
              height: 180,
              maxWidth: "358px",
              objectFit: "cover",
            }}
          />
        </Box>
        <CardContent sx={{ backgroundColor: "#1E1E1E", height: "135px" }}>
          <Box onClick={handleClick}>
            <Typography variant="subtitle1" fontWeight="bold" color="#FFF">
              {title ? `${title.slice(0, 57)}...` : "Titolo non disponibile"}
            </Typography>
          </Box>
          <Link
            to={`/channel/${channel.channelId}`}
            state={{
              channel,
              videos: videos.filter((v) => v.channel?.channelId === channel.channelId), // Passa tutti i video del canale
            }}
          >
            <Typography variant="subtitle2" color="gray">
              {channel.title || "Canale non disponibile"}
              <CheckCircleIcon sx={{ fontSize: "12px", color: "gold", ml: "5px" }} />
            </Typography>
          </Link>
          <Typography variant="text" color="gray" className="clamped-text">
            {description || "Descrizione non disponibile"}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VideoCard;
