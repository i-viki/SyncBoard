import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";

function PrivacyPolicyContent() {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        <strong>Effective Date:</strong> 01 September 2024
      </Typography>

      <Typography paragraph>
        Welcome to <strong>SyncBoard</strong>. This Privacy Policy explains
        how we handle user information and outlines our commitment to privacy
        and transparency.
      </Typography>

      {/* Section Template */}
      {[
        {
          title: "1. What Does SyncBoard Do?",
          content:
            "SyncBoard enables instant real-time sharing of text and images for collaborative use across devices and teams.",
        },
        {
          title: "2. Who Is the Target Audience?",
          content:
            "Our platform is designed for developers, content creators, and teams who need frictionless real-time content sharing.",
        },
        {
          title: "3. What Personal Data Do We Collect?",
          content:
            "We do not collect personal data. No accounts are required, and no identifiable information is stored.",
        },
        {
          title: "4. How Is Data Collected?",
          content:
            "Text or images entered into a board are used solely for real-time collaboration within that board.",
        },
        {
          title: "5. Account Requirement",
          content:
            "SyncBoard operates anonymously. No user registration is required.",
        },
        {
          title: "6. How We Use Shared Data",
          content:
            "Content shared in a board is visible only to participants in that board and is not stored permanently.",
        },
        {
          title: "7. Third-Party Sharing",
          content:
            "We do not share user data with third parties.",
        },
        {
          title: "8. Text and Image Handling",
          content:
            "All shared content remains within the board session environment and is not accessible externally.",
        },
        {
          title: "9. Data Storage",
          content:
            "We do not persistently store personal user data.",
        },
        {
          title: "10. Security Measures",
          content:
            "Data is accessible only to users within the same board code. We implement secure infrastructure practices.",
        },
        {
          title: "11. Data Retention",
          content:
            "User data is not stored beyond active collaboration sessions.",
        },
        {
          title: "12. User Rights",
          content:
            "Users can edit or delete shared content within the active board session.",
        },
        {
          title: "13. Cookies & Tracking",
          content:
            "We do not use cookies or tracking technologies for personal data collection.",
        },
        {
          title: "14. Service Location",
          content: "SyncBoard operates from India.",
        },
        {
          title: "15. Legal Compliance",
          content:
            "Since no personal data is stored, regulatory frameworks such as GDPR are minimally applicable. We may update this policy if operational changes occur.",
        },
        {
          title: "16. Usage Restrictions",
          content:
            "Users must comply with applicable laws and avoid misuse of the platform.",
        },
        {
          title: "17. Downtime or Data Loss",
          content:
            "As a real-time collaboration tool, temporary interruptions may occur. We aim to maintain high availability.",
        },
        {
          title: "18. Policy Updates",
          content:
            "Updates to this Privacy Policy will be reflected on this page.",
        },
        {
          title: "19. Service Changes",
          content:
            "We reserve the right to modify or discontinue features as necessary.",
        },
      ].map((section, index) => (
        <Box key={index} mt={4}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {section.title}
          </Typography>
          <Typography paragraph color="text.secondary">
            {section.content}
          </Typography>
        </Box>
      ))}

      {/* Contact Section */}
      <Box mt={4}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          20. Contact
        </Typography>

        <Typography paragraph color="text.secondary">
          If you have questions regarding this Privacy Policy, please contact
          us via the{" "}
          <Link component={RouterLink} to="/feedback" underline="hover">
            feedback form
          </Link>{" "}
          or email{" "}
          <Link
            href="mailto:jayavignesh324@gmail.com"
            underline="hover"
          >
            jayavignesh324@gmail.com
          </Link>.
        </Typography>
      </Box>
    </Box>
  );
}

export default PrivacyPolicyContent;