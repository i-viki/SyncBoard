import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Fab,
  Tooltip,
  Zoom,
} from "@mui/material";
import { HelpOutlined as HelpOutlineIcon } from "@mui/icons-material";

function FAQsIcon() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/explore#faqs");
  };

  return (
    <Tooltip
      title="Explore FAQs"
      slots={{ transition: Zoom }}
      arrow
    >
      <Fab
        size="small"
        color="primary"
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1300,
          boxShadow: 4,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 8,
          },
        }}
      >
        <HelpOutlineIcon />
      </Fab>
    </Tooltip>
  );
}

export default FAQsIcon;