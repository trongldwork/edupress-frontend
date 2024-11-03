import axios from "axios";
import axiosJWT from "./axiosJWT";
const apiUrl = import.meta.env.VITE_API_URL;

const getLessons = async (accessToken, courseId) => { 
    let response;
    if(accessToken){
        response = await axiosJWT.get(
            `${apiUrl}/lesson/lessons-by-course/${courseId}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
    }else{
        response = await axios.get(`${apiUrl}/lesson/lessons-by-course/${courseId}`);
    }
    return response.data;
}

export default { getLessons }