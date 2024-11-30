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

const Input = styled("input")({
  display: "none",
});

function CourseFormDialog({ open, handleClose, courseServices, onSubmit }) {
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

  const levelOptions = ["Beginner", "Intermediate", "Advanced"];
  const categoryOptions = ["Programming", "Design", "Business", "Marketing"];

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

  const generateUrlSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/đ/g, "d")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Tên khóa học không được để trống";
    if (!formData.category) newErrors.category = "Danh mục không được để trống";
    if (!formData.level) newErrors.level = "Cấp độ không được để trống";
    if (!formData.price) newErrors.price = "Giá không được để trống";
    if (formData.price && isNaN(formData.price))
      newErrors.price = "Giá phải là số";
    if (formData.discountPrice && isNaN(formData.discountPrice))
      newErrors.discountPrice = "Giá khuyến mãi phải là số";
    if (!formData.image) newErrors.image = "Hình ảnh không được để trống";
    if (!formData.description)
      newErrors.description = "Mô tả không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("urlSlug", generateUrlSlug(formData.name));
      formDataToSend.append("category", formData.category);
      formDataToSend.append("level", formData.level);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("discountPrice", formData.discountPrice || 0);
      formDataToSend.append("image", formData.image);
      formDataToSend.append("description", formData.description);

      // Gọi hàm onSubmit được truyền từ component cha
      await onSubmit(formDataToSend);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Form thêm mới khóa học</DialogTitle>
      <DialogContent>
        <Stack spacing={2} p={2}>
          <TextField
            label="Tên khóa học"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            select
            label="Danh mục"
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
            label="Cấp độ"
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
            label="Giá"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
          />

          <TextField
            label="Giá khuyến mãi"
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
                Upload Hình ảnh
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
            label="Mô tả"
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
          Hủy
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CourseFormDialog;
