import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const onhandleSubmit = (event) => {
    event.preventDefault();

    if (searchTerm) {
      navigate(`/search/${searchTerm}`);

      setSearchTerm("");
    }
  };
  return (
    <Paper
      component="form"
      onSubmit={onhandleSubmit}
      sx={{
        borderRadius: 20,
        border: "1px solid #282727",
        pl: 2,
        background: "#131212",
        boxShadow: "none",
        //mr: { sm: 5 },
        display: "flex",
        alignItems: "center",
      }}
    >

      <input
        className="search-bar"
        onChange={(event) => setSearchTerm(event.target.value)}
        value={searchTerm}
        placeholder="Cerca qualcosa..."
        style={{ border: "none", background: "transparent", color: "white", padding: "10px", flex: 1 }}
      />

      <IconButton type="submit" sx={{ p: "10px", color: "#efc064" }}>
        <Search />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
