import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

/********************************/
/*         USERS LVL 1          */
/********************************/

//################################
//          STUDENTS
//################################

//Create
export const createProgramS = async (programToCreate) => {
    console.log("PROGRAM SERVICE : CREATE PROGRAM");
    try {
        const response = await axios.post(`${backend_url}/Program/program`, programToCreate);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

export const programRegistrationS = async (requestParams) => {
    console.log("PROGRAM SERVICE : PROGRAM REGISTRATION");
    try {
        const response = await axios.post(`${backend_url}/UserProgram/register-student`, requestParams);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Read
export const getProgramsS = async () => {
    console.log("PROGRAM SERVICE : GET PROGRAM");
    try {
        const response = await axios.get(`${backend_url}/Program/programs`);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Update

//Delete
