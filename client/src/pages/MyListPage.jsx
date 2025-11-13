import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';

// This is a reusable component for pages that are not yet built.
const PlaceholderPage = ({ title }) => {
  const theme = useTheme();

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: 8, 
        p: 4, 
        textAlign: 'center', 
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[3]
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        color="primary"
        fontWeight={700}
      >
        {title}
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary"
      >
        This List Page construction. Check back soon for exciting anime content!
      </Typography>
      <Box sx={{ mt: 3 }}>
        {/* Placeholder visual element */}
        <Typography variant="h1" sx={{ color: theme.palette.grey[400] }}>
          🚧
        </Typography>
      </Box>
    </Container>
  );
};

export default PlaceholderPage;