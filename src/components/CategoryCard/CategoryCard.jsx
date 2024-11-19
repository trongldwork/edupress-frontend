import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import { createSearchParams, useNavigate } from 'react-router-dom';

const CategoryCard = ({ name, icon: IconComponent }) => {
  const navigate = useNavigate();

  const handleCLickCard = (e) => {
    navigate({
      pathname: "courses",
      search: createSearchParams({
          category: name
      }).toString()
  })
  }

  return (
    <Card
      onClick={handleCLickCard}
      sx={{
        display: 'flex',
        width: '180px',
        height: '180px',
        textAlign: 'center',
        boxShadow: 2,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 1,
          }}
        >
          <IconComponent fontSize="large" color="primary" />
        </Box>
        <Typography variant="h6" component="div">
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;