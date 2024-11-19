import axios from "axios";
import axiosJWT from "./axiosJWT";
const apiUrl = import.meta.env.VITE_API_URL;

const postReview = async (accessToken, reviewData) => {
  const response = await axiosJWT.post(
    `${apiUrl}/course-review/create`,
    reviewData,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
};

const getReviewsByCourse = async (courseId) => {
  const response = await axios.get(
    `${apiUrl}/course-review/get-by-course/${courseId}`
  );
  return response.data;
};

const deleteReview = async (accessToken, reviewId) => {
  const response = await axiosJWT.delete(
    `${apiUrl}/course-review/delete/${reviewId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default {
  postReview,
  getReviewsByCourse,
  deleteReview,
};
