import React from "react";
import { Stack } from "@mui/material";
import { categories } from "../utils/constants";

const SideBar = ({ selectedCategory, setSelectedCategory  }) => {
  if (typeof setSelectedCategory !== "function") {
    console.error("setSelectedCategory is not a function");
    return null;
  }

  return (
    <Stack
      direction="row"
      sx={{
        flexDirection: { md: "column" },
        overflowY: "auto",
        height: { sx: "auto", md: "95%" },
      }}
    >
      {categories.map((category) => (
        <button
          key={category.name}
          className="category-btn"
          onClick={() => setSelectedCategory(category.name)}
          style={{
            background: category.name === selectedCategory ? "gold" : "transparent", // Set gold for selected
            color: "white",
            marginTop: "30px",
            textAlign: "left",
            width: "max-content",
            marginBottom: "-20px",
          }}
        >
          <span
            style={{
              color: category.name === selectedCategory ? "white" : "gold",
              marginRight: "8px",
            }}
          >
            {category.icon}
          </span>
          <span
            style={{
              opacity: category.name === selectedCategory ? "1" : "0.8",
            }}
          >
            {category.name}
          </span>
        </button>
      ))}
    </Stack>
  );
};

export default SideBar;
