import axios from "axios";
import axiosJWT from "./axiosJWT";
const apiUrl = import.meta.env.VITE_API_URL;

const login = async ({ userName, password }) => {
  const response = await axios.post(
    `${apiUrl}/user/login`,
    { userName, password }
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

export const updateAvatar = async (accessToken, avatarFile) => {
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

export const updateUserInfo = async (accessToken, updatedUser) => {
  const response = await axiosJWT.put(`${apiUrl}/user/update`, updatedUser, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  return response.data;
};

export default {
  login,
  register,
  getUserProfile,
  logoutUser,
  refreshToken,
  updateAvatar,
  updateUserInfo,
};
