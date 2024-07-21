import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

export const subcribe = async () => {
    
}

export const getStudentCoursesS = async (requestParams) => {
    console.log("COURSE SERVICE : GET STUDENT COURSES");
    try {
        const response = await axios.post(`${backend_url}/UserCourse/student-courses`, requestParams);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

export const changeCourse = async () => {
    
}