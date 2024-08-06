import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

/********************************/
/*         USERS LVL 1          */
/********************************/

//################################
//          STUDENTS
//################################

//Create

//Read
export const getProgramsS = async () => {
    console.log("PROGRAM SERVICE : GET CLASSROOMS");
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
