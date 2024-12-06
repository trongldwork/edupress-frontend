import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, CircularProgress, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import userServices from "../../services/userServices";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("verify_token");

  const mutation = useMutation({
    mutationFn: async ({ email, otp, password }) => {
      return userServices.resetPassword(email, otp, password);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to reset password.");
    },
    onSuccess: () => {
      setSuccess("Password reset successfully!");
      setTimeout(() => navigate("/sign-in"), 2000); // Chuyển đến trang đăng nhập
    },
  });

  const handleSubmit = () => {
    setError("");
    if (!password || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    mutation.mutate({ email, otp, password });
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        minHeight: "600px", // Chiều cao tổng thể lớn hơn
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px", // Đệm để box không sát màn hình
        borderTop: "2px solid #F5F5F5",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "16px", // Bo tròn
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Đổ bóng
          padding: "30px", // Đệm bên trong box
          width: "100%",
          maxWidth: "500px", // Độ rộng tối đa của box
        }}
      >
        <Typography variant="h5" textAlign="center" mb={2} sx={{ color: "#333" }}>
          Reset Password
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <TextField
          fullWidth
          label="New Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px", // Bo tròn input
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px", // Bo tròn input
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={mutation.isLoading}
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "48px", // Chiều cao nút đồng bộ
          }}
        >
          {mutation.isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Reset Password"}
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;
