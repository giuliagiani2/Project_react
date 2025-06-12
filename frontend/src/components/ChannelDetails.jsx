import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { Videos, Loader } from "./";

const ChannelDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [channelDetail, setChannelDetail] = useState(location.state?.channel || null);
  const [channelVideos, setChannelVideos] = useState(location.state?.videos || []);

  useEffect(() => {
    if (!channelDetail || !channelVideos.length) {
      console.error("Dati del canale o dei video mancanti.");
    }
  }, [channelDetail, channelVideos]);

  if (!channelDetail) return <Loader />;
  if (!channelVideos.length)
    return (
      <Typography variant="h6" sx={{ color: "white" }}>
        Nessun corso disponibile per questo canale.
      </Typography>
    );

  return (
    <Box minHeight="95vh">
      <Box>
        <div
          style={{
            height: "300px",
            background: "linear-gradient(to right, #FFD700, #FFECB3, #CD853F)",
            zIndex: 10,
          }}
        />
        <Box sx={{ textAlign: "center", marginTop: "-110px" }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
            {channelDetail.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "gray" }}>
            {channelDetail.description || "Nessuna descrizione disponibile."}
          </Typography>
          <Typography variant="body2" sx={{ color: "gray" }}>
            Iscritti: {channelDetail.statistics?.subscriberCount || "N/A"}
          </Typography>
        </Box>
      </Box>

      <Box p={2}>
        <Typography
          variant="h5"
          fontWeight="bold"
          mt={4}
          mb={2}
          sx={{ color: "white" }}
        >
          Corsi pubblicati
        </Typography>
        <Videos videos={channelVideos} />
      </Box>
    </Box>
  );
};

export default ChannelDetails;
