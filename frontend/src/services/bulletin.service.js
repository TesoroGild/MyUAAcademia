import axios from 'axios';

const backend_url = process.env.VITE_API_URL_AZ || import.meta.env.VITE_API_URL;

export const create = async (billToCreate) => {
    
}

export const getStudentBulletinS = async (permanentCode) => {
    console.log("BULLETIN SERVICE : GET");
    try {
        const response = await axios.get(`${backend_url}/Bulletin/bulletin/${permanentCode}`);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

export const update = async (billToModify) => {
    
}