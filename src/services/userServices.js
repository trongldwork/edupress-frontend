// UserService.js
import axios from "axios";
import axiosJWT, { handleGetAccessToken } from "./axiosJWT";
const apiUrl = import.meta.env.VITE_API_URL;

// Đăng nhập
const login = async ({ userName, password }) => {
  const response = await axios.post(
    `${apiUrl}/user/login`,
    { userName, password },
    { withCredentials: true }
  );
  return response.data;
};

// Đăng ký người dùng
const register = async (data) => {
  const response = await axios.post(`${apiUrl}/user/register`, data);
  return response.data;
};

// Lấy thông tin người dùng
const getUserProfile = async (accessToken) => {
  const response = await axiosJWT.get(`${apiUrl}/user/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

// Đăng xuất người dùng
const logoutUser = async () => {
  const response = await axios.post(`${apiUrl}/user/logout`);
  return response.data;
};

// Làm mới token
const refreshToken = async () => {
  const res = await axios.post(`${apiUrl}/user/refresh-token`, {}, {
    withCredentials: true, // Tự động lấy cookie (refresh_token)
  });
  return res.data;
};

// Cập nhật ảnh đại diện
const updateAvatar = async (accessToken, avatarFile) => {
  const formData = new FormData();
  formData.append("avatarFile", avatarFile);

  const response = await axiosJWT.put(`${apiUrl}/user/updateAvatar`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Cập nhật thông tin người dùng
const updateUserInfo = async (accessToken, updatedUser) => {
  const response = await axiosJWT.put(`${apiUrl}/user/update`, updatedUser, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  return response.data;
};

// Tìm kiếm người dùng (dành cho quản trị viên)
const searchUsers = async (query) => {
  const _accessToken = handleGetAccessToken();
  const response = await axiosJWT.get(`${apiUrl}/admin/search`, { params: query },
    { headers: { Authorization: `Bearer ${_accessToken}` } }
  );
  return response.data;
};

// Xóa người dùng (dành cho quản trị viên)
const deleteUser = async (userId) => {
  const _accessToken = handleGetAccessToken();
  const response = await axiosJWT.delete(`${apiUrl}/user/admin/${userId}`,
    { headers: { Authorization: `Bearer ${_accessToken}` } }
  );
  return response.data;
};

// Lấy tất cả người dùng (dành cho quản trị viên)
const getUsers = async () => {
  const _accessToken = handleGetAccessToken();
  const response = await axiosJWT.get(`${apiUrl}/user/admin/get-all`,
    { headers: { Authorization: `Bearer ${_accessToken}` } }
  );
  return response.data;
};

// Tạo người dùng mới (dành cho quản trị viên)
const createUser = async (userData) => {
  const _accessToken = handleGetAccessToken();
  const response = await axiosJWT.post(`${apiUrl}/user/admin/create-user`, userData,
    { headers: { Authorization: `Bearer ${_accessToken}` } }
  );
  return response.data;
};

// Cập nhật thông tin người dùng (dành cho quản trị viên)
const editUserProfile = async (userData) => {
  const _accessToken = handleGetAccessToken();
  const response = await axiosJWT.put(`${apiUrl}/user/admin/edit-profile`, userData ,
    { headers: { Authorization: `Bearer ${_accessToken}` } }
  );
  return response.data;
};

const forgotPassword = async (email) => {
  const res = await axios.post(`${apiUrl}/user/forgot-password/${email}`);
  return res.data;
}

const verifyResetPasswordOTP = async (email, otp) => {
  const res = await axios.post(`${apiUrl}/user/verify-reset-password-token/${email}`, {
    OTP: otp
  });
  return res.data;
}

const resetPassword = async (email, otp, password) => {
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
  searchUsers,
  deleteUser,
  getUsers,
  createUser,
  editUserProfile,
  forgotPassword,
  verifyResetPasswordOTP,
  resetPassword,
  changePassword
};
