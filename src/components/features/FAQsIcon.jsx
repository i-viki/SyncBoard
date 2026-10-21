import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Fab,
  Tooltip,
  Zoom,
} from "@mui/material";
import { HelpOutlineOutlined as HelpOutlineIcon } from "@mui/icons-material";

function FAQsIcon() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/explore#faqs");
  };

  return (
    <Tooltip
      title="Explore FAQs & Guide"
      slots={{ transition: Zoom }}
      arrow
    >
      <Fab
        size="small"
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1300,
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: "#141414",
          border: "1px solid #262626",
          color: "#ffffff",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 10px 30px rgba(0, 0, 0, 0.5)",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            backgroundColor: "#1c1c1c",
            borderColor: "#0099ff",
            color: "#0099ff",
            transform: "scale(1.05)",
            boxShadow: "0 0 20px rgba(0, 153, 255, 0.25), 0 12px 35px rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <HelpOutlineIcon sx={{ fontSize: 20 }} />
      </Fab>
    </Tooltip>
  );
}

export default FAQsIcon;