import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";

const HorizontalCourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate(`/course/${course?.urlSlug}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        borderRadius: 3,
        boxShadow: 3,
        width: "100%",
        transition: "transform 0.3s, box-shadow 0.3s", // Thêm hiệu ứng chuyển đổi
        "&:hover": {
          transform: "scale(1.02)", // Phóng to nhẹ khi hover
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Thay đổi shadow khi hover
        },
      }}
    >
      {/* Left Section with Image and Category */}
      <Box
        sx={{
          position: "relative",
          width: "40%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <img
          src={course?.image} // Use the thumbnail URL from course data
          alt={course?.name}
          style={{ width: "100%", borderRadius: "12px" }}
        />
        <Chip
          label={course?.category}
          sx={{
            position: "absolute",
            top: 10,
            left: 15,
            fontWeight: "bold",
            backgroundColor: "black",
            color: "white",
            borderRadius: "5px",
          }}
        />
      </Box>

      {/* Right Section with Course Info */}
      <CardContent sx={{ width: "60%" }}>
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
        <Box sx={{ display: "flex", gap: "10px", marginBottom: "50px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon sx={{ fontSize: 16, color: "orange" }} />
            <Typography variant="body2">{course?.students} Students</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EqualizerIcon sx={{ fontSize: 16, color: "orange" }} />
            <Typography variant="body2">{course?.level}</Typography>
          </Box>
        </Box>
        <hr style={{ opacity: "0.3" }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {(course.discountPrice !== null && course.discountPrice !== undefined) && (
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
              color={(course.discountPrice === 0) ? "green" : "primary"}
              sx={{ fontSize: "20px", fontWeight: "bold" }}
            >
              {(course.discountPrice !== null && course.discountPrice !== undefined)
                ? course?.discountPrice === 0
                  ? "Free"
                  : `$${course?.discountPrice.toFixed(2)}`
                : `$${course?.price.toFixed(2)}`}
            </Typography>
          </Box>
          <Button variant="outlined" size="small" onClick={handleClick} >
            View More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HorizontalCourseCard;
