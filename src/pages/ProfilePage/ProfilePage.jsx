import React, { useState, useEffect, useLayoutEffect } from "react";
import BasePadding from "../../components/BasePadding/BasePadding";
import {
  BreadcrumbWrapper,
  PageContainer,
  ProfileHeaderWrapper,
  UserAvatarContainer,
  UserAvatarWrapper,
  UserInfoFormContainer,
  UserProfileInfoWrapper,
  UserProfileWrapper,
} from "./styled";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import userServices from "../../services/userServices.js";
import { changeAvatar, updateUserProfile } from "../../redux/userStore.js";
import { handleGetAccessToken } from "../../services/axiosJWT.js";
import { useMutation } from "@tanstack/react-query"; // React Query v5

function ProfilePage() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = handleGetAccessToken();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  const [isAvatarLoading, setAvatarLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // For managing alerts
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Homepage
    </Link>,
    <Typography key="2" sx={{ color: "text.primary" }}>
      User profile
    </Typography>,
  ];

  // Avatar upload mutation
  const avatarUploadMutation = useMutation({
    mutationFn: async (file) => {
      const accessToken = handleGetAccessToken();
      return userServices.updateAvatar(accessToken, file);
    },
    onSuccess: (respond) => {
      dispatch(changeAvatar({ avatarUrl: respond.data.avatarUrl }));
      setAvatar(respond.data.avatarUrl);
      setAlertMessage({
        type: "success",
        text: "Avatar updated successfully!",
      });
    },
    onError: (e) => {
      setAlertMessage({ type: "error", text: "Error uploading avatar." });
    },
  });

  const handleAvatarUpload = (e) => {
    avatarUploadMutation.mutate(e.target.files[0]);
    e.target.value = ""; // reset the file input
  };

  // Save user profile mutation
  const saveProfileMutation = useMutation({
    mutationFn: async (updatedUser) => {
      const accessToken = handleGetAccessToken();
      return userServices.updateUserInfo(accessToken, updatedUser);
    },
    onSuccess: (data) => {
      const { updatedUser } = data;
      if (updatedUser) {
        dispatch(updateUserProfile(updatedUser));

        setAlertMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
      }
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      setAlertMessage({ type: "error", text: "Error updating profile." });
    },
  });

  const handleSave = () => {
    saveProfileMutation.mutate({ email, name });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  //Vào trang đăng nhập khi chưa có access token
  useEffect(() => {
    if (!accessToken) {
      navigate("/sign-in");
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setAvatar(user?.avatarUrl);
  }, [user?.email, user?.name, user?.avatarUrl]);

  useEffect(() => {
    if (alertMessage?.type) {
      setOpenSnackbar(true);
    }
  }, [alertMessage?.type, alertMessage?.text]);

  useEffect(() => {
    setAvatarLoading(avatarUploadMutation.isPending);
  }, [avatarUploadMutation.isPending]);

  useEffect(() => {
    setSaving(saveProfileMutation.isPending);
  }, [saveProfileMutation.isPending]);

  return (
    <PageContainer>
      <BreadcrumbWrapper>
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </BreadcrumbWrapper>
      <BasePadding backgroundColor="white" paddingLeftRightPercent={20}>
        <UserProfileWrapper>
          <ProfileHeaderWrapper>Personal info</ProfileHeaderWrapper>
          <UserProfileInfoWrapper>
            <UserAvatarContainer
              sx={{ position: "relative", opacity: isAvatarLoading ? 0.5 : 1 }}
            >
              {isAvatarLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    zIndex: 1,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <UserAvatarWrapper>
                <Avatar
                  src={avatar || ""}
                  sx={{ bgcolor: "orange", width: "80px", height: "80px" }}
                >
                  {name[0]?.toUpperCase()}
                </Avatar>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={isAvatarLoading}
                >
                  Upload Avatar
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleAvatarUpload}
                  />
                </Button>
              </UserAvatarWrapper>
            </UserAvatarContainer>

            <UserInfoFormContainer
              sx={{ position: "relative", opacity: isSaving ? 0.5 : 1 }}
            >
              {isSaving && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    zIndex: 1,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <TextField
                fullWidth
                label="Email"
                value={email}
                margin="normal"
                disabled={isSaving}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                disabled={isSaving}
              />
              <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{ marginTop: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{ color: "white" }}
                  disabled={isSaving}
                >
                  Save
                </Button>
              </Stack>
            </UserInfoFormContainer>
          </UserProfileInfoWrapper>
        </UserProfileWrapper>
      </BasePadding>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {alertMessage && (
          <Alert
            onClose={handleCloseSnackbar}
            severity={alertMessage.type}
            sx={{ width: "100%" }}
          >
            {alertMessage.text}
          </Alert>
        )}
      </Snackbar>
    </PageContainer>
  );
}

export default ProfilePage;
