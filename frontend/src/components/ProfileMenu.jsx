import React, { useState } from "react";
import { Link } from "react-router-dom";
import { user, userWhite } from "../utils/constants";

const ProfileMenu = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to="/login"
      style={{ display: "flex", alignItems: "center", transition: "0.3s ease-in-out!important", WebkitTransition: "0.3s ease-in-out!important", MozTransition: "0.3s ease-in-out!important", OTransition: "0.3s ease-in-out!important", MsTransition: "0.3s ease-in-out!important" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={isHovered ? userWhite : user}
        alt="user login"
        height={28}
        style={{
          transition: "0.3s ease-in-out!important",
          /*WebkitTransition: "0.3s ease-in-out!important",
          MozTransition: "0.3s ease-in-out!important",
          OTransition: "0.3s ease-in-out!important",
          MsTransition: "0.3s ease-in-out!important"*/
        }}
      />
    </Link>
  );
};

export default ProfileMenu;
