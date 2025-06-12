// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Footer, RegisterPage, LoginPage, Navbar, Feed, SearchFeed, ChannelDetails, VideoDetails, CorsoDetails } from "./components";
import { fetchVideos } from "./fetch/videos";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import PrivateRoute from "./components/PrivateRoute";
import AbbonamentiPage from "./components/AbbonamentiPage";
import Pagamento from "./components/Pagamento";
import AreaRiservata from "./components/AreaRiservata";
import Successo from "./components/Successo";
import FAQPage from "./components/FAQPage";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getVideos = async () => {
      const videos = await fetchVideos();
      setVideos(videos);
    };
    getVideos();
  }, []);
//console.log(videos);


  //  tema personalizzato mui
  const theme = createTheme({
    palette: {
      primary: {
        main: "#efc064",
      },
      secondary: {
        main: "#3f51b5",
      },

    },
  });



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ backgroundColor: "#000" }}>
        <Navbar />

        <Routes>
          <Route path="/" element={<Feed videos={videos} />} />
          <Route path="/corso/:id" element={<PrivateRoute element={<CorsoDetails videos={videos} />} />} />
          <Route path="/video/:id" element={<PrivateRoute element={<VideoDetails videos={videos} />} />} />
          <Route path="/channel/:id" element={<PrivateRoute element={<ChannelDetails videos={videos} />} />} />
          <Route path="/search/:searchTerm" element={<PrivateRoute element={<SearchFeed videos={videos} />} />} />

          <Route path="/faq" element={<FAQPage/>} />
          <Route path="/abbonamenti" element={<AbbonamentiPage />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/successo" element={<Successo />} />
          <Route path="/area-riservata" element={<PrivateRoute element={<AreaRiservata />} />} />
          <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} adminOnly={true} />} />
          {/*<Route path="/transazione" element={<Transazione />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
