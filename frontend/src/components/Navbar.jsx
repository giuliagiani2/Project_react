import React, { useEffect, useState } from "react";
import { Stack, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../utils/constants";
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("utente_id"));
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem("role") === "admin");
  const navigate = useNavigate();

  // Funzione per controllare lo stato di login e ruolo
  const checkLoginStatus = () => {
    setIsLoggedIn(!!sessionStorage.getItem("utente_id"));
    const role = sessionStorage.getItem("role");
    setIsAdmin(role === "admin");

  };

  // Effettua il check della sessione ogni volta che cambia "sessionStorage"
  useEffect(() => {
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  // Aggiorna lo stato periodicamente
  useEffect(() => {
    const interval = setInterval(checkLoginStatus, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("utente_id");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("isLoggedIn"); // Rimuovi anche lo stato di login
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      p={2}
      sx={{
        position: "sticky",
        top: 0,
        justifyContent: "space-between",
        background: "#000000fa",
        zIndex: "99999",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="logo" height={60} />
      </Link>

      <Stack direction="row" alignItems="center" sx={{ ml: "auto" }} spacing={2}>
        <SearchBar />

        {isLoggedIn && (
          <>
            {isAdmin && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/admin")}
              >
                Admin Panel
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/area-riservata")}
            >
              Area Riservata
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}

        {!isLoggedIn && <ProfileMenu />}
      </Stack>
    </Stack>
  );
};

export default Navbar;
