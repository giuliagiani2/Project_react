// src/components/Speakers.jsx
import React from "react";
import { Stack, Box, Typography, Tooltip, Zoom } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ChannelCard, Loader } from "./";

const Speakers = ({ videos, direction }) => {
  const navigate = useNavigate();

  if (!videos?.length) return <Loader />;

  const uniqueChannels = videos.reduce((acc, video) => {
    if (video.channel && !acc.some((ch) => ch.channelId === video.channel.channelId)) {
      acc.push(video.channel);
    }
    return acc;
  }, []);

  const handleChannelClick = (channel) => {
    const channelVideos = videos.filter(
      (video) => video.channel?.channelId === channel.channelId
    );

    navigate(`/channel/${channel.channelId}`, {
      state: {
        channel,
        videos: channelVideos,
      },
    });
  };

  return (
    <Stack
      direction={direction || "row"}
      flexWrap="wrap"
      justifyContent="center"
      alignItems="start"
      gap={3}
    >
      {uniqueChannels.map((channel, index) => (
        <Tooltip
          key={index}
          title={`Vai a ${channel.title}`}
          placement="top"
          arrow
          TransitionComponent={Zoom}
        >
          <Box
            onClick={() => handleChannelClick(channel)}
            sx={{
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <ChannelCard channelDetail={channel} />
          </Box>
        </Tooltip>
      ))}
    </Stack>
  );
};

export default Speakers;
