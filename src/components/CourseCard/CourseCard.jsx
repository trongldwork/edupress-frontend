/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate(`/course/${course?.urlSlug}`);
  };

  return (
    <Card
      css={css`
        width: 322px;
        overflow: hidden;
        border-radius: 10px;
        transition:
          transform 0.3s ease-in-out,
          box-shadow 0.3s ease-in-out;
        &:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
      `}
    >
      <Box
        css={css`
          overflow: hidden;
        `}
      >
        <CardMedia
          component="img"
          height="200"
          image={course?.image}
          alt={course?.name}
          sx={{
            transition: "transform 0.3s ease-in-out",
            objectFit: "contain",
          }}
        />
      </Box>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            cursor: "pointer",
            transition: "color 0.3s ease-in-out",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "&:hover": {
              color: "#ff7f50",
            },
          }}
          onClick={handleClick}
        >
          {course?.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {course?.category}
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {course?.discountPrice !== null &&
            course?.discountPrice !== undefined && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textDecoration: "line-through" }}
              >
                ${course?.price.toFixed(2)}
              </Typography>
            )}
          <Typography
            component="span"
            color={course?.discountPrice === 0 ? "green" : "primary"}
            sx={{ fontSize: "20px", fontWeight: "bold" }}
          >
            {course?.discountPrice !== null &&
            course?.discountPrice !== undefined
              ? course?.discountPrice === 0
                ? "Free"
                : `$${course?.discountPrice}`
              : `$${course?.price}`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          css={css`
            color: white;
          `}
          onClick={handleClick}
        >
          View More
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
