import axios from "axios";
import axiosJWT from "./axiosJWT";
const apiUrl = import.meta.env.VITE_API_URL;

const login = async ({ userName, password }) => {
  const response = await axios.post(
    `${apiUrl}/user/login`,
    { userName, password },
    { withCredentials: true }
  );
  return response.data;
};

const register = async (data) => {
  const response = await axios.post(`${apiUrl}/user/register`, data);
  return response.data;
};

const getUserProfile = async (accessToken) => {
  const response = await axiosJWT.get(`${apiUrl}/user/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

const logoutUser = async () => {
  const response = await axios.post(`${apiUrl}/user/logout`);
  return response.data;
};

const refreshToken = async () => {
  const res = await axios.post(
    `${apiUrl}/user/refresh-token`,
    {},
    {
      withCredentials: true, //Tự động lấy cookie(refresh_token) đính vào req
    }
  );
  return res.data;
};

const updateAvatar = async (accessToken, avatarFile) => {
  const formData = new FormData();
  formData.append("avatarFile", avatarFile);

  const response = await axiosJWT.put(`${apiUrl}/user/updateAvatar`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

const updateUserInfo = async (accessToken, updatedUser) => {
  const response = await axiosJWT.put(`${apiUrl}/user/update`, updatedUser, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  return response.data;
};

const forgotPassword = async (email) => {
  const res = await axios.post(`${apiUrl}/user/forgot-password/${email}`);
  return res.data;
}

const verifyResetPasswordOTP = async (email, otp) => {
  console.log(otp);
  
  const res = await axios.post(`${apiUrl}/user/verify-reset-password-token/${email}`, {
    OTP: otp
  });
  return res.data;
}

const resetPassword = async (email, otp, password) => {
  console.log(email, otp, password);
  
  const res = await axios.patch(`${apiUrl}/user/reset-password`, {
    email,
    verify_code: otp,
    password
  });
  return res.data;
}

const changePassword = async (accessToken, currentPassword, newPassword) => {
  const response = await axios.patch(`${apiUrl}/user/change-password`, {
    currentPassword,
    newPassword
  }, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return response.data;
}

export default {
  login,
  register,
  getUserProfile,
  logoutUser,
  refreshToken,
  updateAvatar,
  updateUserInfo,
  forgotPassword,
  verifyResetPasswordOTP,
  resetPassword,
  changePassword
};
