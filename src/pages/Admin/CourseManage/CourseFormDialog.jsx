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
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import { handleGetAccessToken } from "../../../services/axiosJWT";

const Input = styled("input")({
  display: "none",
});

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  position: "absolute",
  zIndex: theme.zIndex.drawer + 1,
}));

function CourseFormDialog({
  open,
  handleClose,
  courseServices,
  refetchCourses,
}) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
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

  const handleShowSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const createCourseMutation = useMutation({
    mutationFn: async (courseData) => {
      const accessToken = handleGetAccessToken();
      return await courseServices.createCourse(courseData, accessToken);
    },
    onMutate: () => {
      setIsLoading(true); // Show loader when mutation starts
    },
    onSuccess: () => {
      setIsLoading(false); // Hide loader when mutation succeeds
      handleShowSnackbar("Course added successfully", "success");
      refetchCourses();
      handleClose();
      resetForm();
    },
    onError: (error) => {
      setIsLoading(false);
      handleShowSnackbar(
        error.response?.data?.message || "Failed to add course",
        "error"
      );
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      urlSlug: "",
      category: "",
      level: "",
      price: "",
      discountPrice: "",
      image: null,
      description: "",
    });
    setImagePreview("");
    setErrors({});
  };

  const handleAddCourse = (courseData) => {
    const formData = new FormData();
    formData.append("name", courseData.name);
    formData.append("urlSlug", courseData.urlSlug);
    formData.append("category", courseData.category);
    formData.append("level", courseData.level);
    formData.append("price", courseData.price);
    formData.append("discountPrice", courseData.discountPrice);
    formData.append("image", courseData.image);
    formData.append("description", courseData.description);
    createCourseMutation.mutate(formData);
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

  const handleSubmit = () => {
    if (!validateForm()) return;

    try {
      handleAddCourse(formData);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <Box>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Box position="relative">
          <StyledBackdrop open={isLoading}>
            <CircularProgress color="primary" />
          </StyledBackdrop>
          <DialogTitle>New Course Form</DialogTitle>
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
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CourseFormDialog;
