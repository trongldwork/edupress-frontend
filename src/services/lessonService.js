import axios from "axios";
import axiosJWT from "./axiosJWT";
const apiUrl = import.meta.env.VITE_API_URL;

// Lấy danh sách bài học của một khóa học
const getLessons = async (accessToken, courseId) => {
  let response;
  if (accessToken) {
    response = await axiosJWT.get(`${apiUrl}/lesson/lessons-by-course/${courseId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } else {
    response = await axios.get(`${apiUrl}/lesson/lessons-by-course/${courseId}`);
  }
  return response.data;
};

// Tạo bài học mới (Admin)
const createLesson = async (accessToken, data) => {

  const response = await axiosJWT.post(`${apiUrl}/lesson/admin/create`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

// Lấy chi tiết bài học theo ID (Admin)
const getLessonById = async (accessToken, lessonId) => {
  const response = await axiosJWT.get(`${apiUrl}/lesson/admin/details/${lessonId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

// Cập nhật bài học (Admin)
const updateLesson = async (accessToken, lessonId, data) => {
  const response = await axiosJWT.put(`${apiUrl}/lesson/admin/update/${lessonId}`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

// Xóa bài học (Admin)
const deleteLesson = async (accessToken, lessonId) => {
  const response = await axiosJWT.delete(`${apiUrl}/lesson/delete/${lessonId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export default {
    getLessons,
    createLesson,
    getLessonById,
    updateLesson,
    deleteLesson,
};
