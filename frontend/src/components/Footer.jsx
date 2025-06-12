import React, { useMemo } from "react";
import { Typography, Stack } from '@mui/material';
import { Link } from "react-router-dom";
import { logo } from "../utils/constants";


const Footer = () => {
  var annoCorrente = useMemo(() => new Date().getFullYear(), []);

  return (
    <Stack
      direction="column"
      alignItems="center"
      sx={{
        position: "relative",
        background: "#000",
        bottom: '0',
        width: '100%',

      }}
    >
      <Link to="/" style={{ display: "flex", margin: "auto", alignItems: "center" }}>
        <img src={logo} alt="logo" height={100} />
      </Link>
      <Typography variant="caption" sx={{ color: '#fff', margin: '20px auto' }}>
        © {annoCorrente} All Right Reserved.
      </Typography>

    </Stack>
  );
};

export default Footer;
