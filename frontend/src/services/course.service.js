import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

//Create
export const register = async (userCourses) => {
    console.log("COURSE SERVICE : REGISTER");
    try {
        const response = await axios.post(`${backend_url}/UserCourse/register-student-for-a-course`, userCourses);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Read
export const getAvailableCoursesS = async (availableCourses) => {
    console.log("COURSE SERVICE : GET COURSES AVAILABLE");
    try {
        const response = await axios.post(`${backend_url}/ClasseCourse/courses/sessions`, availableCourses);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}
// export const getAvailableCoursesS = async (availableCourses) => {
//     console.log("COURSE SERVICE : GET COURSES AVAILABLE");
//     try {
//         const response = await axios.post(`${backend_url}/Course/courses/sessions`, availableCourses);
//         return response.data;
//     } catch (error) {
//         console.error('Erreur :', error);
//         throw error;
//     }
// }

export const getCoursesS = async () => {
    console.log("COURSE SERVICE : GET COURSES AVAILABLE");
    try {
        const response = await axios.get(`${backend_url}/Course/courses`);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
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