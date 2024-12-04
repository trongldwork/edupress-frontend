import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import userServices from "../../services/userServices";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (email) => {
      return userServices.forgotPassword(email);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Something went wrong.");
    },
    onSuccess: () => {
      navigate(`/account/recovery/otp?email=${encodeURIComponent(email)}`);
    },
  });

  const { isPending } = mutation;

  const handleSubmit = () => {
    setError("");
    if (!email) {
      setError("Email is required.");
      return;
    }
    mutation.mutate(email);
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        minHeight: "500px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderTop: "2px solid #F5F5F5"
      }}
    >
      <Box
        sx={{
          borderRadius: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "30px",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Typography variant="h5" textAlign="center" mb={2} style={{ color: "black" }}>
          Forgot Password
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isPending ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Send OTP"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
