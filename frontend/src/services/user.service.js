import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

/********************************/
/*         USERS LVL 1          */
/********************************/

//################################
//          STUDENTS
//################################

//Create
export const admissionS = async (studentToRegister) => {
    console.log("USER SERVICE : ADMISSION STUDENTS");
    try {
        const response = await axios.post(
            `${backend_url}/User/students`, 
            studentToRegister
        );
        return { success: true, studentRegistered: response.data };
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data[""]?.[0]
            };
        }

        return { success: false, message: "Impossible de contacter le serveur." };
    }
} 

export const createStudentS = async (studentToRegister) => {
  console.log("USER SERVICE : CREATE STUDENTS");
  try {
    const response = await axios.post(`${backend_url}/User/students`, studentToRegister);
    return { success: true, studentRegistered: response.data }
  } catch (error) {
    if (error.response) {
        return {
            success: false,
            message: error.response.data[""]?.[0] || error.response.data.title
        };
    }

    return { success: false, message: "Impossible de contacter le serveur." };
  }
}


//Read
export const getStudentS = async (permanentCode) => {
    console.log("USER SERVICE : GET STUDENT");
    try {
        const response = await axios.get(`${backend_url}/User/students/${permanentCode}`);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

// export const getStudent1S = async (permanentCode) => {
//     console.log("USER SERVICE : GET STUDENT");
//     try {
//         const response = await axios.get(`${backend_url}/User/students1/${permanentCode}`);
//         return response.data;
//     } catch (error) {
//         console.error('Erreur :', error);
//         throw error;
//     }
// }

export const getStudentsS = async () => {
    console.log("USER SERVICE : GET STUDENTS");
    try {
        const response = await axios.get(`${backend_url}/User/students`);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

export const getStudentsInProgramS = async (classeCourse) => {
    console.log("USER SERVICE : GET STUDENTS IN MY COURSE");
    try {
        const response = await axios.get(`${backend_url}/User/program/${classeCourse}`);
        return { 
            success: true, 
            students: response.data 
        }
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data[""]?.[0] || error.response.data.title
            };
        }

        return { 
            success: false, 
            message: "Impossible de contacter le serveur." 
        };
    }
}

export const getProgramStudentsS = async (progTitle) => {
    console.log("USER SERVICE : GET STUDENTS");
    try {
        const response = await axios.get(`${backend_url}/UserProgram/students-in-the-program/${progTitle}`);
        return { 
            success: true, 
            students: response.data 
        }
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data[""]?.[0] || error.response.data.title
            };
        }

        return { 
            success: false, 
            message: "Impossible de contacter le serveur." 
        };
    }
}

export const getStudentsInfosS = async () => {
  console.log("USER SERVICE : GET STUDENTS WITH MORE INFOS");
  try {
      const response = await axios.get(`${backend_url}/User/studentsV2`);
      return response.data;
  } catch (error) {
      console.error('Erreur :', error);
      throw error;
  }
}

export const getStudentsNotInProgramS = async () => {
    console.log("USER SERVICE : GET STUDENTS NOT IN PROGRAM");
    try {
        const response = await axios.get(`${backend_url}/UserProgram/students-not-in-a-program`);
        return { success: true, studentsNotEnrolled: response.data }
    } catch (error) {
    if (error.response) {
        return {
            success: false,
            message: error.response.data[""]?.[0] || error.response.data.title
        };
    }

    return { success: false, message: "Impossible de contacter le serveur." };
  }
}

//Update
export const activeStudentAccountS = async (activateAccount) => {
    console.log("USER SERVICE : ACTIVE STUDENT ACCOUNT");
    try {
        const response = await axios.put(`${backend_url}/User/students/activate`, activateAccount);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Delete

//################################
//          PROFESSORS
//################################


/********************************/
/*         USERS LVL 2          */
/********************************/

//Create

//Read

//Update

//Delete
