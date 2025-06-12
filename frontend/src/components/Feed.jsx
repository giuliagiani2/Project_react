// src/components/Feed.jsx
import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import SideBar from "./SideBar";
import Videos from "./Videos";
import Speakers from "./Speakers";
import FAQPage from "./FAQPage";
import { videoPaths } from "../utils/constants";

const Feed = ({ videos }) => {
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [filteredVideos, setFilteredVideos] = useState(videos);

  useEffect(() => {
    const filterVideos = () => {
      if (
        selectedCategory === "New" ||
        selectedCategory === "Tutti i corsi" ||
        selectedCategory === "Per relatore"
      ) {
        setFilteredVideos(videos);
      } else if (selectedCategory === "FAQ") {
        setFilteredVideos([]);
      } else {
        const filtered = videos.filter((video) =>
          video.category
            .split(",")
            .map((cat) => cat.trim())
            .includes(selectedCategory)
        );
        setFilteredVideos(filtered);
      }
    };
    filterVideos();
  }, [selectedCategory, videos]);

  return (
    <Stack sx={{ flexDirection: { xs: "column", md: "row" }, bgcolor: "#121212" }}>
      <Box
        sx={{
          height: { xs: "auto", md: "100vh" },
          borderRight: "1px solid #2d2d2d",
          px: 2,
          py: 2,
          bgcolor: "#1e1e1e",
        }}
      >
        <SideBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </Box>
      <Box
        p={3}
        sx={{
          overflowY: "auto",
          flex: 1,
          height: "100vh",
          color: "white",
        }}
      >
        {selectedCategory === "FAQ" ? (
          <FAQPage />
        ) : (
          <>
            <Typography variant="h4" fontWeight="bold" mb={2}>
              {selectedCategory}{" "}
              <Typography component="span" variant="h5" color="gold">
                - Seleziona un corso
              </Typography>
            </Typography>
            <Divider sx={{ mb: 3, borderColor: "#444" }} />

            {filteredVideos.length === 0 ? (
              <Typography variant="h6">
                Non sono ancora disponibili corsi per questa categoria.
              </Typography>
            ) : selectedCategory === "Per relatore" ? (
              <Speakers videos={filteredVideos} />
            ) : (
              <Videos
                videos={filteredVideos.map((video) => ({
                  ...video,
                  url: `${videoPaths[video.courseId]}${video.videoId}`,
                }))}
              />
            )}
          </>
        )}
      </Box>
    </Stack>
  );
};

export default Feed;
