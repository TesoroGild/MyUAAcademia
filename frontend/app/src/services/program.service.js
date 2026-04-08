import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

//Create
export const createProgramS = async (programToCreate) => {
    try {
        const response = await axios.post(`${backend_url}/Program/program`, programToCreate);
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

export const programRegistrationS = async (requestParams) => {
    try {
        const response = await axios.post(`${backend_url}/UserProgram/register-student`, requestParams);
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

//Read
export const getProgramsS = async () => {
    try {
        const response = await axios.get(`${backend_url}/Program/programs`);
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

export const getProgramsByGradeS = async (grade) => {
    try {
        const response = await axios.get(`${backend_url}/Program/programs/${grade}`);
        return {
            success: true, 
            programs: response.data
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

export const getStudentProgramsS = async (permanentcode) => {
    try {
        const response = await axios.get(`${backend_url}/Program/${permanentcode}`);
        return {
            success: true, 
            programs: response.data
        };
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


//Update
export const registerToAProgramS = async (requestParams) => {
    try {
        const response = await axios.put(`${backend_url}/UserProgram/programs-admitted`, requestParams);
        return {
            success: true, 
            isEnrolleed: response.data
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


//Delete
