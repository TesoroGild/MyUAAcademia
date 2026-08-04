import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

//Create
export const admissionS = async (studentToRegister) => {
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
    try {
        const response = await axios.get(`${backend_url}/User/students/${permanentCode}`);
        return response.data;
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

export const getStudentsS = async () => {
    try {
        const response = await axios.get(`${backend_url}/User/students`);
        return response.data;
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

export const getStudentsInProgramS = async (classeCourse) => {
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
  try {
      const response = await axios.get(`${backend_url}/User/studentsV2`);
      return response.data;
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

export const getStudentsNotInProgramS = async () => {
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
export const activeStudentAccountS = async (activationRequest) => {
    try {
        const response = await axios.put(`${backend_url}/User/students/activate`, activationRequest);
        return response.data;
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

export const validateUserS = async (validationRequest) => {
    try {
        const response = await axios.put(`${backend_url}/User/validate`, validationRequest);
        return response.data;
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

//Delete
