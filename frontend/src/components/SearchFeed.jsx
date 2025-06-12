import { useState, useEffect } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import Videos from "./Videos";

const SearchFeed = ({ videos }) => {
  const { searchTerm } = useParams();
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videos || !Array.isArray(videos)) {
      console.error("Invalid videos data");
      setFilteredVideos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.channel?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || // Ensure channel exists
      video.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
    setLoading(false);
  }, [searchTerm, videos]);

  return (
    <Box p={2} minHeight="95vh">
      <Typography
        variant="h4"
        fontWeight={900}
        color="white"
        mb={3}
        ml={{ sm: "100px" }}
      >
        Risultati per{" "}
        <span style={{ color: "#FC1503" }}>{searchTerm}</span>
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box display="flex">
          <Box sx={{ mr: { sm: "50px" } }} />
          <Videos videos={filteredVideos} />
          <Box sx={{ ml: { sm: "50px" } }} />
        </Box>
      )}
    </Box>
  );
};

export default SearchFeed;
