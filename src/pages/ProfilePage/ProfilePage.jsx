import React, { useState, useEffect } from "react";
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
  Modal,
} from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import userServices from "../../services/userServices.js";
import { changeAvatar, updateUserProfile } from "../../redux/userStore.js";
import { handleGetAccessToken } from "../../services/axiosJWT.js";
import { useMutation } from "@tanstack/react-query";

function ProfilePage() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = handleGetAccessToken();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  const [alertMessage, setAlertMessage] = useState(null); // Quản lý thông báo
  const [openSnackbar, setOpenSnackbar] = useState(false); // Trạng thái Snackbar

  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false); // Trạng thái Modal
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Homepage
    </Link>,
    <Typography key="2" sx={{ color: "text.primary" }}>
      User profile
    </Typography>,
  ];

  // Mutation tải lên avatar
  const avatarUploadMutation = useMutation({
    mutationFn: async (file) => {
      return userServices.updateAvatar(accessToken, file);
    },
    onSuccess: (respond) => {
      dispatch(changeAvatar({ avatarUrl: respond.avatarUrl }));
      setAvatar(respond.avatarUrl);
      setAlertMessage({
        type: "success",
        text: "Avatar updated successfully!",
      });
    },
    onError: () => {
      setAlertMessage({ type: "error", text: "Error uploading avatar." });
    },
  });

  // Mutation lưu hồ sơ
  const saveProfileMutation = useMutation({
    mutationFn: async (updatedUser) => {
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
      setAlertMessage({ type: "error", text: error?.response?.data?.message });
    },
  });

  // Mutation thay đổi mật khẩu
  const changePasswordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword }) => {
      return userServices.changePassword(accessToken, currentPassword, newPassword );
    },
    onSuccess: () => {
      setAlertMessage({
        type: "success",
        text: "Password changed successfully!",
      });
      setChangePasswordOpen(false);
    },
    onError: (error) => {
      setAlertMessage({ type: "error", text: error?.response?.data?.message });
    },
  });

  const { isPending: isPendingChangePassword } = changePasswordMutation;

  const handleSave = () => {
    saveProfileMutation.mutate({ email, name });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setAlertMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const handleAvatarUpload = (e) => {
    avatarUploadMutation.mutate(e.target.files[0]);
    e.target.value = ""; // Reset file input
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Điều hướng nếu chưa có token
  useEffect(() => {
    if (!accessToken) {
      navigate("/sign-in");
    }
  }, [accessToken, navigate]);

  // Gán giá trị user vào state
  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setAvatar(user?.avatarUrl);
  }, [user?.email, user?.name, user?.avatarUrl]);

  // Hiển thị thông báo nếu có alertMessage
  useEffect(() => {
    if (alertMessage?.type) {
      setOpenSnackbar(true);
    }
  }, [alertMessage]);

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
              sx={{ position: "relative", opacity: avatarUploadMutation?.isPending ? 0.5 : 1 }}
            >
              {avatarUploadMutation?.isPending && (
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
                  disabled={avatarUploadMutation?.isPending}
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
              sx={{ position: "relative", opacity: saveProfileMutation?.isPending ? 0.5 : 1 }}
            >
              {saveProfileMutation?.isPending && (
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
                disabled
              />
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                disabled={saveProfileMutation?.isPending}
              />
              <Stack direction="row" justifyContent="space-between" sx={{ marginTop: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setChangePasswordOpen(true)}
                >
                  Change Password
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{ color: "white" }}
                  disabled={saveProfileMutation?.isPending}
                >
                  Save
                </Button>
              </Stack>
            </UserInfoFormContainer>
          </UserProfileInfoWrapper>
        </UserProfileWrapper>
      </BasePadding>

      {/* Modal Change Password */}
      <Modal open={isChangePasswordOpen} onClose={() => setChangePasswordOpen(false)}>
        <Box sx={{ padding: 4, background: "white", borderRadius: 2, width: "300px", margin: "auto", marginTop: "10%" }}>
          <Typography variant="h6" sx={{ marginBottom: 2, color: 'black' }}>
            Change Password
          </Typography>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
          <Stack direction="row" justifyContent="flex-end" sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              disabled={isPendingChangePassword}
            >
              {isPendingChangePassword ? <CircularProgress size={20} /> : "Change"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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
