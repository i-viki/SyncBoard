import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

function FAQsContent({ question, answer }) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: "16px !important",
        border: "1px solid #262626",
        backgroundColor: "#141414",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        overflow: "hidden",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:before": { display: "none" },
        "&.Mui-expanded": {
          borderColor: "#0099ff",
          boxShadow: "0 0 0 1px #0099ff, 0 12px 30px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              color: "#999999",
              transition: "transform 0.3s ease",
            }}
          />
        }
        sx={{
          px: 3,
          py: 1,
          "& .MuiAccordionSummary-content": {
            my: 1.5,
          },
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(180deg)",
            color: "#ffffff",
          },
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "16px",
            letterSpacing: "-0.3px",
            color: "#ffffff",
          }}
        >
          {question}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
        <Box
          sx={{
            color: "#999999",
            fontSize: "14px",
            lineHeight: 1.6,
            letterSpacing: "-0.14px",
          }}
        >
          {answer}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default FAQsContent;