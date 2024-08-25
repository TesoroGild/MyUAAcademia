import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;


/********************************/
/*           COURSE             */
/********************************/

//Create
export const createCourseS = async (course) => {
    console.log(course)
    console.log("COURSE SERVICE : CREATE COURSE");
    try {
        const response = await axios.post(`${backend_url}/Course/courses`, course);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Register several students for a course
export const courseRegistrationS = async (requestParams) => {
    console.log("COURSE SERVICE : CREATE COURSE-REGISTRATIONS");
    try {
        const response = await axios.post(`${backend_url}/UserCourse/register-students-to-a-course`, requestParams);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Register several courses for a students
export const coursesRegistrationS = async (requestParams) => {
    console.log("COURSE SERVICE : CREATE COURSES-REGISTRATION");
    try {
        const response = await axios.post(`${backend_url}/UserCourse/register-courses-for-a-student`, requestParams);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

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

export const getCoursesBySessionYearS = async (sessionProgram) => {
    console.log("COURSE SERVICE : GET COURSES BY SESSION YEAR");
    try {
        const response = await axios.post(`${backend_url}/Course/courses/session-year-program`, sessionProgram);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

export const getProgramCoursesS = async (programTitle) => {
    console.log("COURSE SERVICE : GET COURSES AVAILABLE");
    try {
        const response = await axios.get(`${backend_url}/Course/courses/program/${programTitle}`);
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

//Update
export const updateCourses = async () => {
    
}

//Delete



/********************************/
/*          CLASSROOM           */
/********************************/

//Create
export const createClassroomS = async (course) => {
    console.log(course)
    console.log("COURSE SERVICE : CREATE CLASSROOM");
    try {
        const response = await axios.post(`${backend_url}/Classe/classes`, course);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Read
export const getClassroomsS = async () => {
    console.log("COURSE SERVICE : GET CLASSROOMS");
    try {
        const response = await axios.get(`${backend_url}/Classe/classes`);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Update

//Delete



/********************************/
/*        CLASSE-COURSE         */
/********************************/

//Create
export const createClasseCourseS = async (classeCourse) => {
    console.log("COURSE SERVICE : CREATE CLASSE-COURSE");
    try {
        const response = await axios.post(`${backend_url}/ClasseCourse/classe-course`, classeCourse);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Read
export const getClassesCoursesBySessionYearS = async (sessionProgram) => {
    console.log("COURSE SERVICE : GET COURSES BY SESSION YEAR");
    try {
        const response = await axios.post(`${backend_url}/ClasseCourse/classes-courses-by-program-session`, sessionProgram);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Update

//Delete