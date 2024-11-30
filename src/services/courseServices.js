import axios from "axios";
import axiosJWT from "./axiosJWT";
const apiUrl = import.meta.env.VITE_API_URL;

// Lấy danh sách tất cả các khóa học
const getCourses = async (queries) => {
  const response = await axios.get(`${apiUrl}/course/get-courses`, {
    params: queries,
  });
  
  return response.data;
};

// Lấy chi tiết một khóa học theo URL slug
const getCourse = async (urlSlug) => { 
  const response = await axios.get(`${apiUrl}/course/detail/url/${urlSlug}`);
  
  return response.data;
};

// Lấy danh sách các khóa học của người dùng đã xác nhận
const getMyCourses = async (accessToken) => {
  const response = await axiosJWT.get(`${apiUrl}/course/my-courses`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  return response.data;
}

// Tạo nhiều khóa học
const createCoursesMany = async (data, accessToken) => {
  const response = await axiosJWT.post(
    `${apiUrl}/course/create-many`,
    data,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
};

// Admin: Tạo một khóa học mới
const createCourse = async (formData, accessToken) => {
  const response = await axiosJWT.post(
    `${apiUrl}/course/admin/create`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Admin: Lấy chi tiết một khóa học theo ID
const getCourseById = async (courseId, accessToken) => {
  const response = await axiosJWT.get(`${apiUrl}/course/admin/course/${courseId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

// Admin: Cập nhật khóa học
const updateCourse = async (courseId, formData, accessToken) => {
  const response = await axiosJWT.patch(
    `${apiUrl}/course/admin/${courseId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Admin: Xóa một khóa học
const deleteCourse = async (courseId, accessToken) => {
  const response = await axiosJWT.delete(`${apiUrl}/course/admin/${courseId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

// Admin: Lấy danh sách người dùng đã đăng ký vào khóa học
const getRegisteredUsers = async (courseId, accessToken) => {
  const response = await axiosJWT.get(
    `${apiUrl}/course/admin/${courseId}/registered-users`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
};

export default {
  getCourses,
  getCourse,
  getMyCourses,
  createCoursesMany,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getRegisteredUsers,
};
