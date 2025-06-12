import React from "react";
import { Navigate } from "react-router-dom";

// Componente che protegge le route, reindirizzando al login se non autenticati
const PrivateRoute = ({ element, adminOnly = false }) => {
  const isAuthenticated = sessionStorage.getItem("isLoggedIn"); // Verifica lo stato di login
  const role = sessionStorage.getItem("role"); // Verifica il ruolo dell'utente

  if (!isAuthenticated) {
    // Se non è autenticato, reindirizza alla pagina di login
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== "admin") {
    // Se è una route solo per admin e l'utente non è admin, reindirizza alla home
    return <Navigate to="/" replace />;
  }

  return element; // Se è autenticato, restituisci il componente
};

export default PrivateRoute;