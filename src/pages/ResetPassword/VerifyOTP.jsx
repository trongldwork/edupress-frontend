import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { Box, Button, Typography, Alert, CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import userServices from "../../services/userServices";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const mutation = useMutation({
    mutationFn: async (otp) => {
      return userServices.verifyResetPasswordOTP(email, otp);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Invalid OTP.");
    },
    onSuccess: () => {
      navigate(
        `/account/recovery/reset-password?email=${encodeURIComponent(email)}&verify_token=${encodeURIComponent(otp)}`
      );
    },
  });

  const { isPending } = mutation;

  const handleSubmit = () => {
    setError("");
    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }
    mutation.mutate(otp);
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
        borderTop: "2px solid #F5F5F5"
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" textAlign="center" mb={2} sx={{ color: "#333" }}>
          Verify OTP
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          isInputNum
          shouldAutoFocus
          renderSeparator={<span style={{ margin: "0 5px", color: 'black' }}>-</span>}
          renderInput={(props) => (
            <input
              {...props}
              style={{
                width: "50px", // Input lớn hơn
                height: "60px", // Cao hơn
                fontSize: "22px", // Chữ lớn
                borderRadius: "8px", // Bo tròn input
                border: "1px solid #ccc", // Viền input
                textAlign: "center", // Chữ căn giữa
                backgroundColor: "white", // Màu nền input
                color: "black"
              }}
            />
          )}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "48px", // Chiều cao nút đồng bộ
          }}
        >
          {isPending ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Verify OTP"}
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyOTP;
