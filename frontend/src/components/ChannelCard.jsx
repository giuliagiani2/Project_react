import React from "react";
import { Box, CardContent, CardMedia, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";
import { serverUrl } from "../utils/constants.js";

const ChannelCard = ({ channelDetail, marginTop }) => {
  const imageUrl = channelDetail?.thumbnails?.high ? serverUrl + channelDetail.thumbnails.high : '/images/default.jpg';

  return (
    <Box
      sx={{
        boxShadow: "none",
        borderRadius: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: { xs: "356px", md: "320px" },
        height: "326px",
        margin: "auto",
        marginTop: marginTop || '0',
      }}
    >
      <Link to={`/channel/${channelDetail?.channelId || ""}`}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            alt={channelDetail?.title || "Channel"}
            sx={{
              borderRadius: "50%",
              height: "180px",
              width: "180px",
              mb: 2,
              border: "1px solid #e3e3e3",
              margin: '25px auto',
            }}
          />
          <Typography variant="h6">
            {channelDetail?.title}{" "}
            <CheckCircleIcon sx={{ fontSize: "14px", color: "gray", ml: "5px" }} />
          </Typography>
          {channelDetail?.statistics && (
            <Typography sx={{ fontSize: "15px", fontWeight: 500, color: "gray" }}>
              {parseInt(channelDetail?.statistics.subscriberCount).toLocaleString("en-US")} Subscribers
            </Typography>
          )}
        </CardContent>
      </Link>
    </Box>
  );
};

export default ChannelCard;
