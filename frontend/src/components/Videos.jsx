import React from "react";
import { Stack, Box } from "@mui/material";
import { VideoCard, Loader } from "./";

const Videos = ({ videos, direction }) => {
  if (!videos?.length) return <Loader />;

  return (
    <Stack
      direction={direction || "row"}
      flexWrap="wrap"
      justifyContent="space-evenly"
      alignItems="start"
      gap={2}
      margin="auto"
    >
      {videos.map((item, index) => (
        <Box key={index}>
          {item.videoId && <VideoCard video={item} videos={videos} />}
        </Box>
      ))}
    </Stack>
  );
};

export default Videos;
