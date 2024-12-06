import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import { handleGetAccessToken } from "../../../services/axiosJWT";
import { useEffect } from "react";

const Input = styled("input")({
  display: "none",
});

function CourseEditDialog({
  open,
  handleClose,
  courseServices,
  refetchCourses,
  initialData,
}) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [formData, setFormData] = useState({
    name: "",
    _id: "",
    urlSlug: "",
    category: "",
    level: "",
    price: "",
    discountPrice: "",
    image: null,
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setImagePreview(initialData.image || "");
      setFormData({
        _id: initialData._id || "",
        name: initialData.name || "",
        urlSlug: initialData.urlSlug || "",
        category: initialData.category || "",
        level: initialData.level || "",
        price: initialData.price || "",
        discountPrice: initialData.discountPrice || "",
        image: setImagePreview,
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleShowSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const updateCourseMutation = useMutation({
    mutationFn: async () => {
      try {
        const accessToken = handleGetAccessToken();
        const data = new FormData();

        data.append("name", formData.name || "");
        data.append("category", formData.category || "");
        data.append("level", formData.level || "");
        data.append("price", formData.price || "0");
        data.append("discountPrice", formData.discountPrice || "0");
        if (formData.image) data.append("image", formData.image); // Nếu có hình ảnh mới thì gửi
        data.append("description", formData.description || "");

        return await courseServices.updateCourse(
          initialData._id,
          data,
          accessToken
        );
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to update course"
        );
      }
    },
    onSuccess: () => {
      handleShowSnackbar("Course updated successfully", "success");
      handleClose();
      refetchCourses();
    },
    onError: (error) => {
      handleShowSnackbar(
        error.response?.data?.message || "Failed to add course",
        "error"
      );
    },
  });

  const handleSubmit = () => {
    if (!validateForm()) return;
    updateCourseMutation.mutate();
  };

  const levelOptions = ["Beginner", "Intermediate", "Advanced"];
  const categoryOptions = [
    "Art & Design",
    "Communication",
    "Content Writing",
    "Data Science",
    "Development",
    "Finance",
    "Marketing",
    "Network",
    "Photography",
    "Science",
    "Videography",
    "Web Development",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Course name cannot be empty";
    if (!formData.category) newErrors.category = "Category cannot be empty";
    if (!formData.level) newErrors.level = "Level cannot be empty";
    if (!formData.price) newErrors.price = "Price cannot be empty";
    if (formData.price && isNaN(formData.price))
      newErrors.price = "Price must be a number";
    if (formData.discountPrice && isNaN(formData.discountPrice))
      newErrors.discountPrice = "Discount price must be a number";
    if (!formData.image) newErrors.image = "Image cannot be empty";
    if (!formData.description)
      newErrors.description = "Description cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Course Form</DialogTitle>
      <DialogContent>
        <Stack spacing={2} p={2}>
          <TextField
            label="Course Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={!!errors.category}
            helperText={errors.category}
            fullWidth
          >
            {categoryOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            error={!!errors.level}
            helperText={errors.level}
            fullWidth
          >
            {levelOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
          />

          <TextField
            label="Discount Price"
            name="discountPrice"
            type="number"
            value={formData.discountPrice}
            onChange={handleChange}
            error={!!errors.discountPrice}
            helperText={errors.discountPrice}
            fullWidth
          />

          <Box>
            <label htmlFor="image-upload">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button variant="contained" component="span">
                Upload Image
              </Button>
            </label>
            {errors.image && (
              <Box color="error.main" fontSize="small" mt={1}>
                {errors.image}
              </Box>
            )}
            {imagePreview && (
              <Box mt={2}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </Box>
            )}
          </Box>

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={4}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CourseEditDialog;
