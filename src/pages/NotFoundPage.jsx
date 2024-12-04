import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function NotFoundPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'gray',
        textAlign: 'center',
        padding: 2,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: '#ff6f61', mb: 2 }} />
      <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Oops! The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ padding: '10px 20px', fontSize: '16px' }}
        href="/"
      >
        Go Back to Home
      </Button>
    </Box>
  );
}

export default NotFoundPage;
