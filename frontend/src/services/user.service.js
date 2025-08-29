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

export const createStudentS = async (studentToCreate) => {
  console.log("USER SERVICE : CREATE STUDENTS");
  try {
    const response = await axios.post(`${backend_url}/User/students`, studentToCreate);
    return response.data;
  } catch (error) {
    console.error('Erreur :', error);
    throw error;
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
