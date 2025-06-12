import React from "react";
import { Box, Grid, Typography, Card, CardContent, CardMedia, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChannelList = ({ channels, videos }) => {
  const navigate = useNavigate();

  const handleChannelClick = (channel) => {
    navigate(`/channel/${channel.channelId}`, {
      state: {
        channel,
        videos: videos.filter((video) => video.channel?.channelId === channel.channelId), // Passa tutti i video del canale
      },
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
        Lista dei Canali
      </Typography>
      <Grid container spacing={3}>
        {channels.map((channel) => (
          <Grid item xs={12} sm={6} md={4} key={channel.channelId}>
            <Card sx={{ backgroundColor: "#333", color: "white" }}>
              <CardMedia
                component="img"
                height="140"
                image={channel.thumbnails?.high || "/images/default.jpg"}
                alt={channel.title}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => handleChannelClick(channel)}
                >
                  {channel.title}
                </Typography>
                <Typography variant="body2" color="gray" gutterBottom>
                  {channel.description || "Nessuna descrizione disponibile."}
                </Typography>
                <Typography variant="body2" color="gray">
                  Iscritti: {channel.statistics?.subscriberCount || "N/A"}
                </Typography>
                <Typography variant="body2" color="gray">
                  Corsi pubblicati: {videos.filter((video) => video.channel?.channelId === channel.channelId).length}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                  onClick={() => handleChannelClick(channel)}
                >
                  Vai al Canale
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ChannelList;
