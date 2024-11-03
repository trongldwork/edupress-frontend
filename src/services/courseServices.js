import axios from "axios";
import axiosJWT from "./axiosJWT";
const apiUrl = import.meta.env.VITE_API_URL;

const getCourses = async (queries) => {
  const response = await axios.get(`${apiUrl}/course/get-courses`, {
    params: queries,
  });
  
  return response.data;
};

const getCourse = async (urlSlug) => { 
  const response = await axios.get(`${apiUrl}/course/detail/url/${urlSlug}`);
  
  return response.data;
};

const getMyCourses = async (accessToken) => {
  const response = await axiosJWT.get(`${apiUrl}/course/my-courses`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  return response.data;
}

export default { getCourses, getCourse, getMyCourses };
