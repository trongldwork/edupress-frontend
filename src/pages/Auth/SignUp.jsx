import React, { useState, useEffect } from "react";
import {
    Box,
    Breadcrumbs,
    Link,
    Typography,
    CircularProgress,
    Alert,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Grid2,
  } from "@mui/material";
  import NavigateNextIcon from "@mui/icons-material/NavigateNext";
  import { Visibility, VisibilityOff } from "@mui/icons-material";
  import BasePadding from "../../components/BasePadding/BasePadding";
  import { useMutation } from "@tanstack/react-query";
  import userService from "../../services/userServices.js";
  import { BreadcrumbWrapper } from "./styled";


  function SignUp() {
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/">
          Homepage
        </Link>,
        <Typography key="2" sx={{ color: "text.primary" }}>
          SignUp
        </Typography>,
    ];
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formValues, setFormValues] = useState({
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleChange = (e) =>
        setFormValues({
        ...formValues,
        [e.target.name]: e.target.value,
    });

    // Mutation for form submission
    const { mutate, isPending, isSuccess, isError, error } = useMutation({
        mutationKey: ['registerUser'],
        mutationFn: async (formData) => {
        await userService.register(formData);
        },
        onSuccess: (data) => {
        setSuccessMessage("Registration successful!");
        setErrorMessage("");
        },
        onError: (error) => {
        setErrorMessage(error.response?.data?.message || "Registration failed.");
        setSuccessMessage("");
        },
    });

    // Function to handle form submission
    const handleRegister = (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous error messages

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if email is valid
        if (!emailRegex.test(formValues.email)) {
        setErrorMessage("Invalid email address");
        return;
        }

        // Check if passwords match
        if (formValues.password !== formValues.confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
        }

        // Submit form if all validations pass
        mutate(formValues);
    };    

    // Combined useEffect to handle success, error, and form reset
    useEffect(() => {
        if (isSuccess) {
        // Reset form on success
        setFormValues({
            email: "",
            userName: "",
            password: "",
            confirmPassword: "",
        });
        }
    }, [isSuccess, isError]);

    return (
        <Box sx={{ backgroundColor: "white", paddingBottom: "50px", position: "relative" }}>
          {isPending && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 2,
              }}
            >
              <CircularProgress />
            </Box>
          )}
    
          <BreadcrumbWrapper>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
          </BreadcrumbWrapper>
    
          <BasePadding paddingLeftRightPercent={20}>
            <Box
              sx={{
                borderRadius: "16px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                padding: "50px 250px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: "20px",
                opacity: isPending ? 0.5 : 1, // Reduce opacity when loading
                pointerEvents: isPending ? "none" : "auto", // Disable interactions when loading
              }}
            >
              <Typography variant="h3" sx={{ color: "black" }} textAlign="center">
                Register
              </Typography>
    
              {/* Show success or error messages */}
              {isSuccess && (
                <Alert severity="success">{successMessage}</Alert>
              )}
              {isError && (
                <Alert severity="error">
                  {errorMessage || error?.message || "Registration failed."}
                </Alert>
              )}
    
              <form onSubmit={handleRegister}>
                <Grid2 container spacing={2} direction="column">
                  {/* Email Field */}
                  <Grid2 item>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      variant="outlined"
                      type="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleChange}
                    />
                  </Grid2>
    
                  {/* Username Field */}
                  <Grid2 item>
                    <TextField
                      required
                      fullWidth
                      label="Username"
                      variant="outlined"
                      name="userName"
                      value={formValues.userName}
                      onChange={handleChange}
                    />
                  </Grid2>
    
                  {/* Password Field */}
                  <Grid2 item>
                    <TextField
                      required
                      fullWidth
                      label="Password"
                      variant="outlined"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formValues.password}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid2>
    
                  {/* Confirm Password Field */}
                  <Grid2 item>
                    <TextField
                      required
                      fullWidth
                      label="Confirm Password"
                      variant="outlined"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formValues.confirmPassword}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid2>
    
                  {/* Submit Button */}
                  <Grid2 item>
                    <Button
                      fullWidth
                      variant="contained"
                      color="warning"
                      size="large"
                      style={{ backgroundColor: "#FF6D00" }}
                      type="submit"
                      disabled={isPending}
                    >
                      Register
                    </Button>
                  </Grid2>
                </Grid2>
              </form>
            </Box>
          </BasePadding>
        </Box>
      );
  }

  export default SignUp;