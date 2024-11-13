import axiosJWT from "./axiosJWT"; //Wait for axiosJWT module has been built...
const apiUrl = import.meta.env.VITE_API_URL;

const registerCourse = async (accessToken, courseId) => {
  const response = await axiosJWT.post(
    `${apiUrl}/register-course/register`,
    {
      courseId,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
};

const getRegistration = async (accessToken, courseId) => { 
  const response = await axiosJWT.get(
    `${apiUrl}/register-course/get-registration/${courseId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
};

export default { registerCourse, getRegistration };
