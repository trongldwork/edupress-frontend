import React, { useState, useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  CircularProgress,
  Snackbar,
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import userService from "../../services/userServices.js";
import { BreadcrumbWrapper } from "./styled";
import {useDispatch} from 'react-redux';
import { setUser } from "../../redux/userStore.js";
import userServices from "../../services/userServices.js";
import { handleGetAccessToken } from "../../services/axiosJWT.js";

function Login() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    userName: "",
    password: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = new URLSearchParams(location.search).get("returnUrl") || "/"; // Default to home page
  
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Homepage
    </Link>,
    <Typography key="2" sx={{ color: "text.primary" }}>
      Login
    </Typography>,
  ];
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleChange = (e) =>
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });

  const { mutate, data ,isPending, isSuccess, isError } = useMutation({
    mutationFn: async (formData) => {
      return await userService.login(formData);
    },
    onSuccess: () => {
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
    onError: (error) => {
      setSnackbarMessage(error.response?.data?.message || "Login failed.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    mutate(formValues);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleGetUserProfile = async (accessToken) => {
    try{
        const data = await userServices.getUserProfile(accessToken);       
        dispatch(setUser({ ...data, accessToken: accessToken }));
    }catch(e){
      console.log(e.message);
    }
  };
  
  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('access_token', JSON.stringify(data?.accessToken));
      const accessToken = handleGetAccessToken();
      handleGetUserProfile(accessToken);      
      navigate(returnUrl);
    }
  }, [isSuccess]);


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
            opacity: isPending ? 0.5 : 1,
            pointerEvents: isPending ? "none" : "auto",
          }}
        >
          <Typography variant="h3" sx={{ color: "black" }} textAlign="center">
            Login
          </Typography>

          <form onSubmit={handleLogin}>
            <Grid2 container spacing={2} direction="column">
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
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid2>

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
                  Login
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </Box>
      </BasePadding>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // 3 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
