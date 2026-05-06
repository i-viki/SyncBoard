import React from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import termsData from "../../constants/termsContent";

function TermsConditionsContent() {
  const { effectiveDate, intro, sections } = termsData;

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Terms & Conditions | SyncBoard</title>

        <meta
          name="description"
          content="Read the Terms & Conditions that govern your access to and use of SyncBoard, including user responsibilities, platform usage, and legal agreements."
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://isyncboard.vercel.app/terms-conditions"
        />
      </Helmet>

      <Box>
        {/* Effective Date */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Effective Date:</strong> {effectiveDate}
        </Typography>

        {/* Intro */}
        <Typography paragraph>{intro}</Typography>

        {/* Sections */}
        {sections.map((section) => (
          <Box key={section.id} mt={4}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {section.id}. {section.title}
            </Typography>

            {/* Paragraph Content */}
            {section.content && (
              <Typography paragraph>
                {section.content}
              </Typography>
            )}

            {/* List Content */}
            {section.list && (
              <List sx={{ pl: 2 }}>
                {section.list.map((item, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemText
                      primary={
                        <>
                          <strong>{item.label}:</strong> {item.text}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {/* Contact Section */}
            {section.isContact && (
              <Typography paragraph>
                If you have any questions, please contact us through the{" "}
                <Link component={RouterLink} to="/feedback" underline="hover">
                  feedback form
                </Link>{" "}
                or via email at{" "}
                <Link
                  href="mailto:jayavignesh324@gmail.com"
                  underline="hover"
                >
                  jayavignesh324@gmail.com
                </Link>.
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </>
  );
}

export default TermsConditionsContent;