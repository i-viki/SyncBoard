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

function TermsConditionsContent() {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        <strong>Effective Date:</strong> 01 September 2024
      </Typography>

      <Typography paragraph>
        Welcome to <strong>SyncBoard</strong>. These Terms and Conditions
        govern your use of our platform. By using our service, you agree to
        these terms. If you do not agree, please discontinue use.
      </Typography>

      {/* Section 1 */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        1. Acceptance of Terms
      </Typography>
      <Typography paragraph>
        By accessing or using SyncBoard, you agree to comply with and be
        bound by these Terms and our Privacy Policy. We may update these
        terms periodically, and continued use of the service constitutes
        acceptance of the updated terms.
      </Typography>

      {/* Section 2 */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        2. Description of Service
      </Typography>
      <Typography paragraph>
        SyncBoard enables users to share text and images in real-time
        collaboration boards. It is designed for fast, anonymous content
        exchange across devices and teams.
      </Typography>

      {/* Section 3 */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        3. Use of Service
      </Typography>
      <List sx={{ pl: 2 }}>
        <ListItem disableGutters>
          <ListItemText
            primary={
              <>
                <strong>Eligibility:</strong> You must be at least 13 years
                old to use SyncBoard.
              </>
            }
          />
        </ListItem>

        <ListItem disableGutters>
          <ListItemText
            primary={
              <>
                <strong>No Account Required:</strong> The platform operates
                anonymously without mandatory registration.
              </>
            }
          />
        </ListItem>

        <ListItem disableGutters>
          <ListItemText
            primary={
              <>
                <strong>Prohibited Uses:</strong> You agree not to use the
                service for unlawful activities or to transmit content that
                violates applicable laws.
              </>
            }
          />
        </ListItem>
      </List>

      {/* Section 4 */}
      <Typography variant="h5" fontWeight={600} gutterBottom mt={4}>
        4. Data Handling
      </Typography>
      <List sx={{ pl: 2 }}>
        <ListItem disableGutters>
          <ListItemText
            primary={
              <>
                <strong>Personal Data:</strong> We do not collect personal
                user data. The platform operates anonymously.
              </>
            }
          />
        </ListItem>

        <ListItem disableGutters>
          <ListItemText
            primary={
              <>
                <strong>Board Data:</strong> Content shared within a board is
                used only for real-time collaboration and is not stored
                permanently.
              </>
            }
          />
        </ListItem>
      </List>

      {/* Section 5 */}
      <Typography variant="h5" fontWeight={600} gutterBottom mt={4}>
        5. Intellectual Property
      </Typography>
      <Typography paragraph>
        All platform assets including branding, design, and software are
        the property of SyncBoard and protected under applicable
        intellectual property laws.
      </Typography>

      {/* Section 6 */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        6. Limitation of Liability
      </Typography>
      <Typography paragraph>
        SyncBoard is provided "as is" without warranties of any kind.
        We are not liable for indirect or consequential damages arising
        from the use of our service.
      </Typography>

      {/* Section 7 */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        7. Termination
      </Typography>
      <Typography paragraph>
        We reserve the right to suspend or terminate access to the platform
        at our discretion for violations of these Terms.
      </Typography>

      {/* Section 8 */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        8. Changes to Terms
      </Typography>
      <Typography paragraph>
        We may update these Terms from time to time. Continued use of the
        platform signifies acceptance of those changes.
      </Typography>

      {/* Section 9 */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        9. Governing Law
      </Typography>
      <Typography paragraph>
        These Terms are governed by the laws of India. Any disputes shall
        fall under the jurisdiction of Indian courts.
      </Typography>

      {/* Section 10 */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        10. Contact
      </Typography>
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
    </Box>
  );
}

export default TermsConditionsContent;