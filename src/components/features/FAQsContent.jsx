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
      sx={(theme) => ({
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.02)"
            : "rgba(0,0,0,0.02)",
        overflow: "hidden",
        transition: "all 0.25s ease",
        "&:before": { display: "none" },
        "&.Mui-expanded": {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[4],
        },
      })}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              transition: "transform 0.3s ease",
            }}
          />
        }
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(180deg)",
          },
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>
          {question}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          sx={{
            color: "text.secondary",
            lineHeight: 1.8,
            animation: "fadeIn 0.25s ease",
          }}
        >
          {answer}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default FAQsContent;