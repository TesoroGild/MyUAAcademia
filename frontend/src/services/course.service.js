import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;


/********************************/
/*           COURSE             */
/********************************/

//Create
export const createCourseS = async (course) => {
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
export const enrollStudentsInCoursesS = async (requestParams) => {
    console.log("COURSE SERVICE : CREATE COURSE-REGISTRATIONS");
    try {
        const response = await axios.post(`${backend_url}/UserCourse/students-courses`, requestParams);
        return {
            success: true, 
            response: response.data
        };
    } catch (error) {
        console.error('Erreur :', error.response.data);
    
        if (error.response)
            return {
                success: false,
                message: error.response.data
            };

        return { success: false, message: "Impossible de contacter le serveur" };
    }
}


//Read
export const getAvailableCoursesS = async (availablePeriods, permanentCode) => {
    console.log("COURSE SERVICE : GET COURSES AVAILABLE");
    try {
        const response = await axios.post(`${backend_url}/ClasseCourse/courses/sessions/${permanentCode}`, availablePeriods);
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

export const getProgramCoursesS = async (programTitle) => {
    console.log("COURSE SERVICE : GET COURSES AVAILABLE");
    try {
        const response = await axios.get(`${backend_url}/Course/courses/program/${programTitle}`);///Course/courses/session-year-program
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

export const getStudentCoursesS = async (permanentCode) => {
    console.log("COURSE SERVICE : GET STUDENT COURSES");
    try {
        const response = await axios.get(`${backend_url}/UserCourse/student-courses/${permanentCode}`);
        return {
            success: true, 
            courses: response.data
        }
    } catch (error) {
        console.error('Erreur :', error.response.data);
    
        if (error.response) {
            return {
                success: false,
                message: error.response.data
            };
        }

        return { success: false, message: "Impossible de contacter le serveur" };
    }
}

export const getStudentSessionCoursesS = async (requestParams) => {
    console.log("COURSE SERVICE : GET STUDENT SESSION COURSES");
    try {
        const response = await axios.post(`${backend_url}/ClasseCourse/student-session-courses`, requestParams);
        return {
            success: true, 
            courses: response.data
        }
    } catch (error) {
        console.error('Erreur :', error.response);
    
        if (error.response) {
            return {
                success: false,
                message: error.response.data
            };
        }

        return { success: false, message: "Impossible de contacter le serveur" };
    }
}

export const getSessionCoursePriceS = async (requestParams) => {
    console.log("COURSE SERVICE : GET STUDENT SESSION COURSES");
    try {
        const response = await axios.post(`${backend_url}/Course/student-session-courses`, requestParams);
        return {
            success: true, 
            courses: response.data
        }
    } catch (error) {
        console.error('Erreur :', error.response);
    
        if (error.response) {
            return {
                success: false,
                message: error.response.data
            };
        }

        return { success: false, message: "Impossible de contacter le serveur" };
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
export const createClasseCourseS = async (classeCourseToCreate) => {
    console.log("COURSE SERVICE : CREATE CLASSE-COURSE");
    try {
        const response = await axios.post(`${backend_url}/ClasseCourse/classe-course`, classeCourseToCreate);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Read
export const getClassesCoursesS = async () => {
    console.log("COURSE SERVICE : GET CLASSES-COURSES");
    try {
        const response = await axios.get(`${backend_url}/ClasseCourse/classe-course`);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

export const getProgramSessionCoursesS = async (sessionProgram) => {
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