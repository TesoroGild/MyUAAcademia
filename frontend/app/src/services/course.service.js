import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;


/********************************/
/*           COURSE             */
/********************************/

//Create
export const createCourseS = async (course) => {
    try {
        const response = await axios.post(`${backend_url}/Course/courses`, course);
        return response.data;
    } catch (error) {
        throw error;
    }
}

//Register several students for a course
export const enrollStudentsInCoursesS = async (requestParams) => {
    try {
        const response = await axios.post(`${backend_url}/UserCourse/students-courses`, requestParams);
        return {
            success: true, 
            response: response.data
        };
    } catch (error) {
        if (error.response)
            return {
                success: false,
                message: error.response.data[""]?.[0] || error.response?.data?.message
            };

        return { success: false, message: "Impossible de contacter le serveur" };
    }
}


//Read
export const getAvailableCoursesS = async (availablePeriods, permanentCode) => {
    try {
        const response = await axios.post(`${backend_url}/ClasseCourse/courses/sessions/${permanentCode}`, availablePeriods);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getCoursesS = async () => {
    try {
        const response = await axios.get(`${backend_url}/Course/courses`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getProgramCoursesS = async (programsTitles) => {
    try {
        const response = await axios.post(`${backend_url}/Course/courses/program`, programsTitles);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getStudentCoursesS = async (permanentCode) => {
    try {
        const response = await axios.get(`${backend_url}/UserCourse/student-courses/${permanentCode}`);
        return {
            success: true, 
            courses: response.data
        }
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data[""]?.[0] || error.response?.data?.message
            };
        }

        return { success: false, message: "Impossible de contacter le serveur" };
    }
}

export const getStudentSessionCoursesS = async (requestParams) => {
    try {
        const response = await axios.post(`${backend_url}/ClasseCourse/student-session-courses`, requestParams);
        return {
            success: true, 
            courses: response.data
        }
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data[""]?.[0] || error.response?.data?.message
            };
        }

        return { success: false, message: "Impossible de contacter le serveur" };
    }
}

export const getSessionCoursePriceS = async (requestParams) => {
    try {
        const response = await axios.post(`${backend_url}/Course/student-session-courses`, requestParams);
        return {
            success: true, 
            courses: response.data
        }
    } catch (error) {
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
    try {
        const response = await axios.post(`${backend_url}/Classe/classes`, course);
        return response.data;
    } catch (error) {
        throw error;
    }
}

//Read
export const getClassroomsS = async () => {
    try {
        const response = await axios.get(`${backend_url}/Classe/classes`);
        return response.data;
    } catch (error) {
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
    try {
        const response = await axios.post(`${backend_url}/ClasseCourse/classe-course`, classeCourseToCreate);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const assignProfessorToClasseCourseS = async (profCourseIds) => {
    try {
        const response = await axios.put(`${backend_url}/ClasseCourse/assign-prof-course`, profCourseIds, {withCredentials: true});
        return {
            success: true
        }
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data[""]?.[0] || error.response?.data?.message
            };
        }

        return { success: false, message: "Impossible de contacter le serveur" };
    }
}

//Read
export const getClassesCoursesS = async () => {
    try {
        const response = await axios.get(`${backend_url}/ClasseCourse/classe-course`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getClassesCoursesByProgramS = async (title) => {
    try {
        const response = await axios.get(`${backend_url}/ClasseCourse/classe-course/${title}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getProgramSessionCoursesS = async (sessionProgram) => {
    try {
        const response = await axios.post(`${backend_url}/ClasseCourse/classes-courses-by-program-session`, sessionProgram);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getProfCourseS = async (profCode) => {
    try {
    const response = await axios.get(`${backend_url}/ClasseCourse/professor-courses/${profCode}`, {withCredentials: true});
    return { 
      success: true, 
      courses: response.data 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.response.data[""]?.[0] || error.response?.data?.message || "Aucun élement trouvé" 
    };
  }
}

//Update

//Delete